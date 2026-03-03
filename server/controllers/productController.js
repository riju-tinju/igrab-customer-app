const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { branchId } = req.query;
        const query = {};
        if (branchId) query.branchIds = branchId;

        const products = await Product.find(query).populate('categoryId').populate('brandId');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get products with filtering, search and sorting
exports.getProducts = async (req, res) => {
    try {
        const { search, category, brand, sort, page = 1, limit = 12, branchId } = req.body;
        const query = {};

        // Branch filter
        if (branchId) {
            query.branchIds = branchId;
        }

        // Search filter (name or description)
        if (search && search !== 'NOTHING') {
            query.$or = [
                { 'name.en': { $regex: search, $options: 'i' } },
                { 'name.ar': { $regex: search, $options: 'i' } },
                { 'description.en': { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'All') {
            // We need to resolve category name to ID if it's sent as name
            const Category = require('../models/Category');
            const catDoc = await Category.findOne({ $or: [{ 'name.en': category }, { 'name.ar': category }] });
            if (catDoc) query.categoryId = catDoc._id;
        }

        // Brand filter
        if (brand && brand !== 'NOTHING') {
            const Brand = require('../models/Brand');
            const brandDoc = await Brand.findOne({ $or: [{ name: brand }, { 'name.en': brand }] });
            if (brandDoc) query.brandId = brandDoc._id;
        }

        let sortQuery = {};
        if (sort === 'price-low') sortQuery = { 'pricing.price': 1 };
        else if (sort === 'price-high') sortQuery = { 'pricing.price': -1 };
        else if (sort === 'name-az') sortQuery = { 'name.en': 1 };
        else if (sort === 'name-za') sortQuery = { 'name.en': -1 };
        else if (sort === 'new') sortQuery = { createdAt: -1 };
        else sortQuery = { createdAt: -1 }; // Default

        const products = await Product.find(query)
            .populate('categoryId')
            .populate('brandId')
            .sort(sortQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Product.countDocuments(query);

        res.status(200).json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalProducts: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product by slug
exports.getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ 'meta.slug': req.params.slug })
            .populate('categoryId')
            .populate('brandId');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ categoryId: req.params.categoryId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
