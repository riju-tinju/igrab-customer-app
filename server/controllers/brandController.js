const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(440).json({ message: 'Brand not found' });
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
