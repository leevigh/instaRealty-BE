const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  role: {
    type: String,
    required: true,
    default: "regular",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
