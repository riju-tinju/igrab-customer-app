const Newsletter = require('../models/Newsletter');

exports.subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        let subscriber = await Newsletter.findOne({ email });
        if (subscriber) {
            return res.status(200).json({ success: true, userMessage: 'You are already subscribed!' });
        }

        subscriber = new Newsletter({ email });
        await subscriber.save();

        res.status(201).json({ success: true, userMessage: 'Thank you for subscribing!' });
    } catch (error) {
        res.status(500).json({ success: false, userMessage: 'An error occurred. Please try again later.' });
    }
};
