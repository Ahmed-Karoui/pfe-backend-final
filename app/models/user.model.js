const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name:String,
    email: String,
    password: String,
    last_name: String,
    Birth_date: Date,
    Hire_date: Date,
    gender: String,
    role: String,
    phone: String,
    manager: String,
    days_off: Number,
    creation_date: Date,
    sampleFile:String,
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    leaves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "leave"
      }
    ],

  })
);

module.exports = User;