const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');
const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');
const appointmentModel = require('../models/appointmentModel')


class doctorController {
    constructor() { }

    static registerDoctor = asyncHandler(async (req, res) => {
        const { name, category, languages, fee, edu, experience, email, mobile, clinicaddress, rating, pic } = req.body;
        const doctorExists = await Doctor.findOne({ email });
        if (doctorExists) {
            res.status(400);
            throw new Error('Doctor already exists');
        }
        const user = req.user._id
        const doctor = await Doctor.create({
            name, user, category, languages, fee, edu, experience, email, mobile, clinicaddress, rating, pic
        });
        if (doctor) {
            res.status(201).send({
                _id: doctor._id,
                name: doctor.name,
                category: doctor.category,
                lang: doctor.languages,
                fee: doctor.fee,
                edu: doctor.edu,
                experience: doctor.experience,
                email: doctor.email,
                mobile: doctor.mobile,
                caddress: doctor.clinicaddress,
                rating: doctor.rating,
                pic: doctor.pic,
            })
        } else {
            res.status(400)
            throw new Error('Error Occured');
        }

    })

    static getDoctors = asyncHandler(async (req, res) => {
        const doctors = await Doctor.find({ approved: true });
        if (doctors) {
            res.status(201).send(doctors);
        } else {
            res.status(400)
            throw new Error('Cannot get doctors');
        }
    })

    static approveDoctor = asyncHandler(async (req, res) => {
        const { mongo_ids, user_ids } = req.body.details
        console.log(mongo_ids, user_ids)
        const updatedDoctors = await Doctor.updateMany({ _id: { $in: mongo_ids } }, { approved: true }).populate('user')
        console.log(updatedDoctors)
        await User.updateMany({ _id: { $in: user_ids } }, { isDoctor: true, doctorId: mongo_ids })
        const doctors = await Doctor.find({ approved: false });
        res.status(200).send({ status: 'success', remaining: doctors })
    })

    static deleteDoctor = asyncHandler(async (req, res) => {
        const doctorids = req.body.mongo_ids
        const deletedDoctors = await Doctor.find({ _id: { $in: doctorids } }).populate("user")
        await Doctor.deleteMany({ _id: { $in: doctorids } })
        const user_ids = []
        deletedDoctors.forEach(doctor => {
            user_ids.push(doctor.user._id)
        });
        await User.updateMany({ _id: { $in: user_ids } }, { isDoctor: false, doctorId: null })
        const doctors = await Doctor.find({});
        res.status(200).send({ status: 'success', remaining: doctors })
    })

    static doctorappointments = asyncHandler(async (req, res) => {
        const appointments = await appointmentModel.find({ doctor: req.user.doctorId }).populate('user');
        if (appointments) {
            res.send(appointments)
        }
        else {
            throw new Error('can not fetch appointments');
        }
    })

    static getDoctorById = asyncHandler(async (req, res) => {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById({ _id: doctorId });
        if (doctor) {
            res.send(doctor)
        }
        else {
            throw new Error('can not fetch appointments');
        }
    })

    static getUnapprovedDoctors = asyncHandler(async (req, res) => {
        const doctors = await Doctor.find({ approved: false });
        if (doctors) {
            res.status(200).send(doctors);
        } else {
            res.status(400)
            throw new Error('Cannot get doctors');
        }
    })
}


module.exports = doctorController