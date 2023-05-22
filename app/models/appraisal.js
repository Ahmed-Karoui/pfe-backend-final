const mongoose = require('mongoose')


const AppraisalSchema = new mongoose.Schema({
    previous_date : String,
    user_name: String,
    user_id: String,
    Next_date : Date,
    departement: String,
    user_email: String,
    position:String,
    evaluator:String,
    employee_accomplishement:String,
    manager_accomplishement:String,
    key_facts_employee:String,
    key_facts_manager:String,
    difficulties_employees:String,
    difficulties_manager:String,
    satisfaction_employee:String,
    explication_employee:String,
    objectif1_employee:String,
    objectif2_employee:String,
    objectif3_employee:String,
    objectif1_status:String,
    objectif2_status:String,
    objectif3_status:String,
    addtional_notes_employee:String,
    addtional_notes_manager:String




})

const Appraisal = mongoose.model('Appraisal',AppraisalSchema)

module.exports = Appraisal