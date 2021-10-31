const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        required: true,
        default: "regular"
    },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
});

// userSchema.pre('save', async function(next) {
//     //Hash the password before saving the user model
//     const user = this;
//     if(user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 10)
//     }
//     next()
// })

// userSchema.methods.generateAuthToken = async function() {
//     //Generate user auth token
//     const user = this;
//     const token = jwt.sign({
//         email: user.email,
//         id: user._id,
//         role: user.role
//         }, 
//         process.env.JWT_KEY)

//     user.tokens = user.tokens.concat({token})
//     await user.save()
//     return token
// }

const User = mongoose.model('User', userSchema)
module.exports = User
