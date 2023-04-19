const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');
const contact = require('../models/contactModel');
const appointmentModel = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

class apiControllers {
    constructor() { }

    static postContactData = asyncHandler(async (req, res) => {
        const { name, email, phone, message } = req.body;
        const mess = await contact.create({
            name, email, phone, message
        });

        if (mess) {
            res.status(201).send({
                _id: mess._id,
                name: mess.name,
                email: mess.email,
                phone: mess.phone,
                message: mess.message
            })
        } else {
            res.status(400)
            throw new Error('Error Occured');
        }
    })

    static bookappointment = asyncHandler(async (req, res) => {
        const { name, mobile, email, gender, state, city, reason, dob, age, appointmentDate, appointmentTime } = req.body;
        const user = req.user._id;
        const doctorobj = await Doctor.findOne({ _id: req.query.id });
        const doctor = doctorobj._id;
        const appointment = await appointmentModel.create({
            name, mobile, email, gender, state, city, reason, dob, age, appointmentDate, appointmentTime, user, doctor
        });

        if (appointment) {
            res.status(201).json({ status: 'ok', appointmentId: appointment._id });
        } else {
            res.status(400)
            throw new Error('Error booking an appointment');
        }
    })

    static getappointments = asyncHandler(async (req, res) => {
        const appointments = await appointmentModel.find({ user: req.user._id }).populate('doctor');
        if (appointments) {
            res.send(appointments)
        }
        else {
            throw new Error('can not fetch appointments');
        }
    })

    static deleteAppointment = asyncHandler(async (req, res) => {
        const app = await appointmentModel.findByIdAndDelete(req.query.id)
        if (app) {
            res.redirect('')
        } else {
            throw new Error('connot delete')
        }
    })

    static payment = async (req, res) => {
        let { docId } = req.body
        const doctor = await Doctor.findById({ _id: docId });
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [{
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: req.user.name
                        },
                        unit_amount: doctor.fee * 100
                    },
                    quantity: 1
                }],
                success_url: `${process.env.SERVER_URL}/verified?m1=Payment Successful&m2= `,
                cancel_url: `${process.env.SERVER_URL}/verified?error=error&m1=Payment Failed&m2=Please try again`
            })
            res.json({ status: 'success', url: session.url })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }

    }


}


module.exports = apiControllers