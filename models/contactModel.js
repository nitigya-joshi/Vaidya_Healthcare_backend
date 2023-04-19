const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            max: 50,
        },
        mobile: {
            type: String,
            min: 10,
            max: 10,
        },
        message: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);



const contact = mongoose.model('Contact', contactSchema)

module.exports = contact;