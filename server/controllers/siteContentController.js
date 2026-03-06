const SiteContent = require('../models/SiteContent');

const siteContentController = {
    getSiteContent: async (req, res) => {
        try {
            const siteContent = await SiteContent.findOne().sort({ createdAt: -1 });
            if (!siteContent) {
                return res.status(200).json({
                    success: true,
                    data: null
                });
            }
            res.status(200).json({
                success: true,
                data: siteContent
            });
        } catch (error) {
            console.error('Error fetching site content:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch site content'
            });
        }
    }
};

module.exports = siteContentController;
