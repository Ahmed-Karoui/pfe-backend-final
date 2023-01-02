const mongoose = require('mongoose')

const TestSchema = new mongoose.Schema({
    test_name : {
        type : String,
    },
    test_type : {
        type : String,
    },
    psychological_score : {
        type : Number,
    },
    technical_score : {
        type : Number,
    },
    irt_score : {
        type : Number,
    },
    candidate : {
        type : String,
    },

})

const Test = mongoose.model('Test',TestSchema)

module.exports = Test