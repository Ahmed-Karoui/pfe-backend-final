const mongoose = require('mongoose')
const Project = require('../models/project')


const TaskSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : 'Active',
    },
    member : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"    },
    due_date : {
        type : Date,
    },
    creation_date : {
        type : Date,
        required : true,
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"project"
    }
})

const Task = mongoose.model('Task',TaskSchema)

module.exports = Task