const mongoose = require('mongoose');

const paymentConfigurationSchema = new mongoose.Schema({
    stripe: {
        publishableKey: {
            type: String,
            required: true,
            default: ""
        },
        secretKey: {
            type: String,
            required: true,
            default: ""
        },
        webhookSecret: {
            type: String,
            required: true,
            default: ""
        },
        isEnabled: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    cod: {
        isEnabled: {
            type: Boolean,
            required: true,
            default: false
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PaymentConfiguration', paymentConfigurationSchema);
