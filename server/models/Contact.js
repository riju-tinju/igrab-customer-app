const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    inquiryType: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    storeBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StoreBranch',
        default: null,
    },
    status: {
        type: String,
        enum: ['new', 'read', 'archived'],
        default: 'new',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
