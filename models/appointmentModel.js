const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const appointmentSchema = mongoose.Schema(
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
            required: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
            max: 120
        },
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },
        appointmentTime: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Doctor'
        }
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment;