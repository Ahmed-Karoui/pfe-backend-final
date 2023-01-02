const mongoose = require('mongoose')

const LeaveSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    start_date : {
        type : Date,
        required : true
    },
    end_date : {
        type : Date,
        required : true,
    },
    status : {
        type : String,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user.model"
    }
})

const Leave = mongoose.model('Leave',LeaveSchema)

module.exports = Leave