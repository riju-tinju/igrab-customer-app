const Order = require('../models/Order');
const User = require('../models/User');
const Store = require('../models/StoreBranch');
const PaymentConfiguration = require('../models/PaymentConfiguration');
const DeliveryCharge = require('../models/DeliveryCharge');
const Charging = require('../models/Charging');
const Product = require('../models/Product');
const stripe = require('stripe');

// Helper: Calculate distance between two coordinates in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Get Payment Config (Publishable Key)
exports.getPaymentConfig = async (req, res) => {
    try {
        const config = await PaymentConfiguration.findOne({});
        if (!config) {
            return res.status(200).json({
                stripe: { isEnabled: false },
                cod: { isEnabled: true }
            });
        }
        // Only send publishable key to client
        const safeConfig = {
            stripe: {
                isEnabled: config.stripe.isEnabled,
                publishableKey: config.stripe.publishableKey
            },
            cod: {
                isEnabled: config.cod.isEnabled
            }
        };
        res.status(200).json(safeConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Summary Info (General Charges)
exports.getSummaryInfo = async (req, res) => {
    try {
        const charges = await Charging.find({});
        const deliveryChargeConfig = await DeliveryCharge.find({ isActive: true });

        res.status(200).json({
            charges: charges.map(c => ({
                name: c.name,
                type: c.type.name,
                value: c.type.value
            })),
            isDeliveryAvailable: deliveryChargeConfig.length > 0,
            allowedEmirates: deliveryChargeConfig.map(c => c.emirate)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Calculate Delivery Charge
exports.calculateDeliveryCharge = async (req, res) => {
    try {
        const { latitude, longitude, emirate, branchId } = req.body;

        if (!latitude || !longitude || !branchId) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const branch = await Store.findById(branchId);
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        const distance = calculateDistance(
            latitude,
            longitude,
            branch.location.coordinates[1],
            branch.location.coordinates[0]
        );

        const chargeConfig = await DeliveryCharge.findOne({
            emirate: { $regex: new RegExp(`^${emirate}$`, 'i') },
            isActive: true
        });

        if (!chargeConfig) {
            return res.status(400).json({ message: `Delivery not available in ${emirate}` });
        }

        let chargeAmount = 0;
        if (chargeConfig.chargeType === 'fixed') {
            chargeAmount = chargeConfig.fixedCharge;
        } else {
            const { baseDistance, baseCost, extraCostPerKm } = chargeConfig.distanceCharge;
            if (distance <= baseDistance) {
                chargeAmount = baseCost;
            } else {
                chargeAmount = baseCost + ((distance - baseDistance) * extraCostPerKm);
            }
        }

        res.status(200).json({
            deliveryCharge: Math.round(chargeAmount * 100) / 100,
            distance: distance.toFixed(2),
            emirate: chargeConfig.emirate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Stripe Payment Intent
exports.createStripeIntent = async (req, res) => {
    try {
        const { totalAmount, orderId } = req.body;
        const config = await PaymentConfiguration.findOne({});

        if (!config || !config.stripe.isEnabled || !config.stripe.secretKey) {
            return res.status(400).json({ message: "Online payment not configured" });
        }

        const stripeClient = stripe(config.stripe.secretKey);
        const intent = await stripeClient.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'aed',
            metadata: { orderId }
        });

        res.status(200).json({ clientSecret: intent.client_secret });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderItems, subTotal, totalAmount, paymentMethod, address, storeId, deliveryCharge } = req.body;

        const orderCount = await Order.countDocuments();
        const orderId = `ORD-${Date.now()}-${orderCount + 1}`;

        const newOrder = new Order({
            orderId,
            userId,
            storeId,
            orderItems,
            subTotal,
            totalAmount,
            paymentMethod: paymentMethod === 'COD' ? 'Cash' : 'Online',
            address: {
                ...address,
                coordinates: {
                    type: 'Point',
                    coordinates: [address.longitude, address.latitude]
                }
            },
            status: 'Pending',
            paymentStatus: 'Unpaid'
        });

        if (deliveryCharge) {
            newOrder.charges = [{ name: 'Delivery Charge', amount: deliveryCharge }];
        }

        // Add additional charges if any
        const chargingDocs = await Charging.find({});
        for (const charge of chargingDocs) {
            let amount = 0;
            if (charge.type.name === 'percentage') {
                amount = (subTotal * charge.type.value) / 100;
            } else {
                amount = charge.type.value;
            }
            newOrder.charges.push({ name: charge.name, amount: Math.round(amount * 100) / 100 });
        }

        const savedOrder = await newOrder.save();

        // Update user order history and sync name if missing
        const updateData = {
            $push: { orderHistory: { orderId: savedOrder._id } }
        };

        // If user doesn't have a firstName yet, sync it from the checkout fullName
        const currentUser = await User.findById(userId);
        if (currentUser && !currentUser.firstName && address.fullName) {
            updateData.firstName = address.fullName;
        }

        await User.findByIdAndUpdate(userId, updateData);

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user orders (with pagination)
exports.getUserOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalOrders = await Order.countDocuments({ userId: req.user.id });
        const orders = await Order.find({ userId: req.user.id })
            .sort({ orderDate: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            orders,
            totalOrders,
            hasMore: totalOrders > (skip + orders.length),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(440).json({ message: 'Order not found' });

        // Check if order belongs to user
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
