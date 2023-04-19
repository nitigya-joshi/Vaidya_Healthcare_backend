const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User'
        },
        category: {
            type: String,
            required: true
        },
        languages: [],
        fee: {
            type: Number,
            required: true,
        },
        edu: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        approved: {
            type: Boolean,
            default: false
        },
        experience: {
            type: Number
        },
        mobile: {
            type: String,
            unique: true,
            min: 10,
            max: 10,
            required: true,
        },
        clinicaddress: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0
        },
        pic: {
            type: String,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
    },
    {
        timestamps: true,
    }
);

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor;