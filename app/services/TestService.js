var express = require('express');
var router = express.Router();
const Test = require('../models/test')

router.post('/add-test', async (req,res) => {
    try{
        let test = new Test({
            test_name:req.body.test_name,
            test_type:req.body.test_type,
            psychological_score:req.body.psychological_score,
            technical_score:req.body.technical_score,
            irt_score:req.body.irt_score,
            candidate:req.body.candidate,

        })
       let createdTest = await test.save() 
       res.status(201).json({
        status : 'Success',
        data : {
            createdTest
        }
    })
    }catch(err){
        console.log(err)
    }
})


router.get('/get-trainings',  (req,res) =>{
    Training.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


router.patch('/update-training/:id', async (req,res) => {
    const updatedTraining = await Training.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                updatedTraining
            }
          })
    }catch(err){
        console.log(err)
    }
})


router.delete('/delete-training/:id', async (req,res) => {
    const id = req.params.id
    await Training.findByIdAndRemove(id).exec()
    res.send('Deleted')
})


// router.get('/get-trainings-by-user/', async (req,res) => {
//     let foundusers =
//     Training.find().populate('users').exec();
//     return foundusers;
//   })


  router.get('/get-trainings-by-user/:id', async (req,res) => {
    const encryptedusersfound = await Training.findById(req.params.id).select('users');
    const records = await User.find().where('_id').in(encryptedusersfound.users).exec();
    res.send(records);
  })

module.exports = router;
