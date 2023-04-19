const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');
const User = require('../models/userModel');
const UserVerification = require('../models/userVerification');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Doctor = require('../models/doctorModel');

require('dotenv').config();

// nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log('successful!', success)
    }
})

const sendVerificationEmail = async ({ _id, email }, res) => {
    const currentUrl = 'http://localhost:3000/';
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p>
        <p>Press <a href=${currentUrl + "api/users/verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`,
    };
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
    if (hashedUniqueString) {
        const newVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,
        })
        const verification = await newVerification.save()
        if (verification) {
            const sent = await transporter.sendMail(mailOptions)
            if (sent) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }

}

const createToken = (id) => {
    return jwt.sign({ id }, 'jwtsecret', {
        expiresIn: 3 * 24 * 60 * 60
    });
};


const registerUser = asyncHandler(async (req, res) => {
    const { name, username, gender, email, password, mobile, address, pic, appointments } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name, username, gender, email, verified: true, password, mobile, address, pic, appointments
    });

    // sendVerificationEmail(user, res);

    if (user) {
        res.status(201).json({ user: user._id });
    } else {
        res.status(400)
        throw new Error('Error Occured');
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        if (user.verified) {
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
            res.status(200).json({ status: 'SUCCESS', user: user });
        } else {
            res.status(400).json({ status: 'FAILED', message: 'Email is not verified. Check your inbox!' })
        }
    }
    else {
        res.status(400).json({ status: 'FAILED', message: 'Invalid email or password' })
    }

})

const logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).json({ message: 'logged out' })
})

const getUserdata = asyncHandler(async (req, res) => {
    if (req.user) {
        res.status(200).json(req.user)
    } else {
        res.status(500).json('no user found!')
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'username', 'mobile', 'address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" })
    }
    updates.forEach((update) => {
        req.user[update] = req.body[update]
    })
    await req.user.save()
    res.send(req.user)
})

const uploadAvatar = asyncHandler(async (req, res) => {
    const profilePic = 'http://localhost:3000/' + req.file.path
    req.user.pic = profilePic
    await req.user.save()
    res.send({ status: true, path: profilePic })
})

const verifyEmail = async (req, res) => {
    const { userId, uniqueString } = req.params;
    try {
        const result = await UserVerification.find({ userId });
        if (result.length > 0) {
            const { expiresAt } = result[0];
            const hashedUniqueString = result[0].uniqueString;
            if (expiresAt < Date.now()) {
                await UserVerification.deleteOne({ userId })
                await User.deleteOne({ _id: userId })
                const message = "Link has expired. Please sign up again.";
                res.send(message);
            } else {
                // valid verification record exist so we proceed
                const verified = await bcrypt.compare(uniqueString, hashedUniqueString);
                if (verified) {
                    // strings match
                    const updatedUser = await User.updateOne({ _id: userId }, { verified: true })
                    await UserVerification.deleteOne({ userId })
                    const token = createToken(userId);
                    res.cookie('jwt', token, { httpOnly: false, maxAge: 3 * 24 * 60 * 60 * 1000 });
                    res.status(201).redirect('/verified?m1=Verification Successful&m2=Please login to proceed');
                } else {
                    const message = "Invalid verification details passed."
                    res.send(message);
                }
            }
        } else {
            const message = "Account record doesn't exist or has been verified already. Please sign up or login."
            res.send(message);

        }
    } catch (error) {
        console.log(error);
        const message = "An error occured while checking for existing user verification record.";
        res.send(message);
    }
}
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ isDoctor: false });
    if (users) {
        res.status(201).send(users);
    } else {
        res.status(400)
        throw new Error('Cannot get users');
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const userids = req.body.mongo_ids
    const result = await User.deleteMany({ _id: { $in: userids } })
    const users = await User.find({ isDoctor: false });
    res.status(200).send({ status: 'success', remaining: users })
})

const makeAdmin = asyncHandler(async (req, res) => {
    const userid = req.query.id;
    const user = await User.findByIdAndUpdate(userid, { isAdmin: true })
    res.status(200).send()
})

module.exports = { registerUser, authUser, logout, updateUser, uploadAvatar, verifyEmail, getUserdata, getAllUsers, deleteUser, makeAdmin };


