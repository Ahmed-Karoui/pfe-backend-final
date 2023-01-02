var express = require('express');
const Appraisal = require('../models/appraisal');
var router = express.Router();
const appraisal = require('../models/appraisal');

function addOneYear(date) {
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  const newyeardate = new Date()


  router.post('/add-appraisal', async (req,res) => {
    try{
        const obj2 = new Appraisal;
        const obj = new appraisal({
            user_name:req.body.user,
            user_id:req.body.user_id,
            previous_date:req.body.previous_date,
            departement:req.body.departement,
            Next_date:addOneYear(newyeardate)
        })
        obj2 = await obj.save() 
       res.status(201).json({
        status : 'Success',
        data : {
            obj2
        }
    })
    }catch(err){
        console.log(err)
    }
})


router.get('/get-appraisals',  (req,res) =>{
    Appraisal.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


router.patch('/update-appraisal/:id', async (req,res) => {
    const updatedAppraisal = await Appraisal.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                updatedAppraisal
            }
          })
    }catch(err){
        console.log(err)
    }
})


router.delete('/delete-appraisal/:id', async (req,res) => {
    const id = req.params.id
    await Appraisal.findByIdAndRemove(id).exec()
    res.send('Deleted')
})


module.exports = router;
