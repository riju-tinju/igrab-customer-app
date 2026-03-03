const Contact = require('../models/Contact');

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, inquiryType, message, storeBranch } = req.body;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const newContact = new Contact({
            name,
            email,
            phone,
            inquiryType,
            message,
            storeBranch: storeBranch || null,
            ipAddress: ipAddress
        });

        await newContact.save();

        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
};
