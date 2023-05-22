const mongoose = require('mongoose')


const CandidateSchema = new mongoose.Schema({
    name:String,
    email: String,
    password: String,
    last_name: String,
    Birth_date: Date,
    gender: String,
    phone: String,
    creation_date: Date,
    status:String,
    test_status:String,
    departement:String,
    irt_score:Number,
    psy_score:Number,
    tech_test:Number,
    irt_test_status:String,
    psy_test_status:String,
    tech_test_status:String,


})

const Candidate = mongoose.model('Candidate',CandidateSchema)

module.exports = Candidate