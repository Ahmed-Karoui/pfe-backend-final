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
    status: String,
    creation_date: Date,

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
    ]
  })
);

module.exports = User;