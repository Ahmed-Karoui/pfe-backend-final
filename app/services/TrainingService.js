var express = require('express');
var router = express.Router();
const Training = require('../models/training')
const User = require('../models/user.model')

router.post('/add-training', async (req,res) => {
    try{
        let training = new Training({
            name:req.body.name,
            description:req.body.description,
            category:req.body.category,
            status:req.body.status,
            training_date:req.body.training_date,
            training_link:req.body.training_link,
            training_responsible:req.body.training_responsible,
            training_type:req.body.training_type,
            users:req.body.users


        })
       let createdTraining = await training.save() 
       await User.updateMany({ '_id': training.users }, { $push: { users: training._id } });
       res.status(201).json({
        status : 'Success',
        data : {
            createdTraining
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
