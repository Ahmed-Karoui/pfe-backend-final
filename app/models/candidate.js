const mongoose = require('mongoose')


const CandidateSchema = new mongoose.Schema({
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
})

const Candidate = mongoose.model('Candidate',CandidateSchema)

module.exports = Candidate