const User = require("../models/User");
const twilio = require("twilio");

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Generate a 6-digit numeric OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Send OTP via SMS
 */
const sendOtpSMS = async (to, otp, type = "verification") => {
    // For automatic OTP detection (Web OTP API), the SMS must follow a specific format:
    // Your iGrab verification code is 123456.
    // 
    // @igrab-app.com #123456

    // For now, using a standard friendly message
    const body = `Your iGrab verification code is ${otp}.\n\n@localhost #${otp}`;

    if (!client || !twilioPhone) {
        console.warn("\x1b[33m%s\x1b[0m", "Twilio credentials not found. LOGGING OTP INSTEAD:");
        console.log("\x1b[42m\x1b[30m%s\x1b[0m", ` OTP for ${to}: ${otp} `);
        return true;
    }

    try {
        await client.messages.create({
            body,
            from: twilioPhone,
            to
        });
        return true;
    } catch (err) {
        console.error("Twilio SMS send failed:", err);
        throw new Error("Failed to send SMS.");
    }
};

/**
 * Handle Signup/Login - Generate and send OTP
 */
exports.signupOrLogin = async (req, res) => {
    try {
        const { countryCode, phone, authMode, name } = req.body;

        if (!countryCode || !phone) {
            return res.status(400).json({ error: "Phone and country code are required" });
        }

        const fullPhone = `${countryCode}${phone}`;
        console.log(`[Auth] signupOrLogin: phone=${fullPhone}, authMode=${authMode}, name=${name}`);
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        let user = await User.findOne({ phone, countryCode });

        if (authMode === "signup" && user) {
            // Instead of erroring, we can just proceed as login but maybe update the name
            console.log(`[Auth] User ${fullPhone} already exists, proceeding as login update.`);
        }

        if (authMode === "login" && !user) {
            return res.status(404).json({
                error: "User not found. Please sign up.",
                code: "USER_NOT_FOUND"
            });
        }

        // Generate/Update User with OTP (temporary if new user)
        if (!user) {
            user = new User({
                firstName: name || "",
                countryCode,
                phone,
                status: "deactive",
            });
        } else if (name) {
            // Update name if provided even for existing user
            user.firstName = name;
        }

        user.otp = {
            otp,
            expiresAt: otpExpiresAt,
            chances: 3
        };

        await user.save();
        await sendOtpSMS(fullPhone, otp, authMode);

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error("Error in signupOrLogin:", err);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};

/**
 * Verify OTP and Merge Guest Data
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { countryCode, phone, otp, guestCart, guestWishlist } = req.body;

        if (!countryCode || !phone || !otp) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ phone, countryCode });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { otp: savedOtp } = user;

        if (!savedOtp || !savedOtp.otp) {
            return res.status(400).json({ error: "No OTP sent to this device" });
        }

        if (savedOtp.chances <= 0) {
            return res.status(400).json({ error: "Max attempts reached. Please request a new OTP." });
        }

        if (new Date() > savedOtp.expiresAt) {
            return res.status(400).json({ error: "OTP expired. Please request a new one." });
        }

        if (String(savedOtp.otp) !== String(otp)) {
            user.otp.chances -= 1;
            await user.save();
            return res.status(400).json({
                error: "Invalid OTP",
                attemptsRemaining: user.otp.chances
            });
        }

        // SUCCESS!
        user.status = "active";
        user.otp = { otp: null, expiresAt: null, chances: 3 };

        // MERGE GUEST DATA
        // Merge Wishlist
        if (guestWishlist && Array.isArray(guestWishlist)) {
            const guestIds = guestWishlist.map(item => item.id);
            const existingWishlist = user.wishlist.map(id => id.toString());
            const mergedWishlist = [...new Set([...existingWishlist, ...guestIds])];
            user.wishlist = mergedWishlist;
        }

        // Merge Cart
        if (guestCart && Array.isArray(guestCart)) {
            const guestCartMap = new Map();
            guestCart.forEach(item => guestCartMap.set(item.id, item.quantity));

            // Update existing cart items
            user.cart.forEach(item => {
                const prodIdStr = item.productId.toString();
                if (guestCartMap.has(prodIdStr)) {
                    item.quantity += guestCartMap.get(prodIdStr);
                    guestCartMap.delete(prodIdStr);
                }
            });

            // Add new guest items to user cart
            guestCartMap.forEach((qty, id) => {
                user.cart.push({
                    productId: id,
                    quantity: qty
                });
            });
        }

        await user.save();

        // Set session user
        req.session.userId = user._id;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                firstName: user.firstName || "",
                phone: user.phone,
                countryCode: user.countryCode,
                status: user.status
            }
        });
    } catch (err) {
        console.error("Error in verifyOTP:", err);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};

/**
 * Check Authentication Status
 */
exports.checkAuthStatus = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ isAuthenticated: false });
        }

        const user = await User.findById(req.session.userId).select("-otp");
        if (!user) {
            return res.status(401).json({ isAuthenticated: false });
        }


        res.status(200).json({
            isAuthenticated: true,
            user: {
                id: user._id,
                firstName: user.firstName || "",
                phone: user.phone,
                countryCode: user.countryCode,
                cart: user.cart,
                wishlist: user.wishlist
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update Profile
 */
exports.updateProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { firstName } = req.body;
        if (!firstName) {
            return res.status(400).json({ error: "Name is required" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.firstName = firstName;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                phone: user.phone,
                countryCode: user.countryCode
            }
        });
    } catch (err) {
        console.error("Error in updateProfile:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Logout
 */
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Could not log out" });
        res.clearCookie("connect.sid");
        res.status(200).json({ success: true, message: "Logged out" });
    });
};
