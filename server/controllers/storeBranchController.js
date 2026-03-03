const StoreBranch = require('../models/StoreBranch');

exports.getAllBranches = async (req, res) => {
    try {
        const branches = await StoreBranch.find({ isActive: true });
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBranchById = async (req, res) => {
    try {
        const branch = await StoreBranch.findById(req.params.id);
        if (!branch) return res.status(440).json({ message: 'Branch not found' });
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNearestBranch = async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'Latitude and Longitude are required' });

    try {
        const branch = await StoreBranch.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    }
                }
            },
            isActive: true
        });
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
