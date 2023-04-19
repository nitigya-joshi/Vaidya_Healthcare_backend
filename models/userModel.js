const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const appointments = require('./appointmentModel')
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true,
        },
        isDoctor: {
            type: Boolean,
            default: false,
            required: true
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        },
        gender: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }
        },
        verified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        mobile: {
            type: String,
            min: 10,
            max: 10,
        },
        address: {
            type: String,
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

// userSchema.virtual('imgsrc').get(function () {
//     if (this.pic.toString('base64').length < 2000) {
//         return '/img/unknown.png';
//     } else {
//         return `data:image/jpg;base64,${this.pic.toString('base64')}`;
//     }
// })

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

userSchema.methods.matchPassword = async function (enteredPass) {
    return await bcrypt.compare(enteredPass, this.password);
}

const User = mongoose.model('User', userSchema)

module.exports = User;