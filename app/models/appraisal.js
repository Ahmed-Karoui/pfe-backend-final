const mongoose = require('mongoose')
 
const AppraisalSchema = new mongoose.Schema({
    previous_date : {
        type : Date,
    },
    user_name:{
        Type:String,
    },
    user_id:{
        Type:String,
    },
    Next_date : {
        type : Date,
    },
    departement:{
        Type:String,
    },
    user_email:{
        Type:String,
    }

})

const Appraisal = mongoose.model('Appraisal',AppraisalSchema)

module.exports = Appraisal