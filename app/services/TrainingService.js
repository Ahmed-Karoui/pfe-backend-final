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
      //   let users1 = req.body.users
      //  let confirmed = []
      //  users1.forEach(element => {
      //   confirmed.push({_id:element,confirmed:'False'})
      //  });
      //  console.log(confirmed)
      //  training.users = confirmed
      //  console.log(training)
       let createdTraining = await training.save() 
       await User.updateMany({ '_id': req.body.users }, { $push: { users: training._id } });
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


  router.get('/get-current-users-trainings/:id', async (req,res) => {
    const alltrainings = await Training.find().select('users');
    const records = await Training.find().where('_id').in(alltrainings).exec();
    res.send(alltrainings);
    for (const [key, value] of Object.entries(alltrainings)) {
  
        //you can do your operations here
        console.log(`Value is ${value._id}`); // "a 5", "b 7", "c 9"
        if(`${value._id}` == (req.params.id)); // "a 5", "b 7", "c 9"
        console.log("true")
      
      }
      
  })

  router.post('/remove-user-from-training/:trainingid', async (req,res) => {
    
  const trainingid = req.params.trainingid;

  const userId = req.body.userId;
  console.log(req.params.trainingid)
  console.log(userId)
  //Training.findOneAndUpdate({ '_id': req.params.trainingid},{ $pull: { users: userId } },{ new: true })

  Training.findOneAndUpdate(
    { '_id': req.params.trainingid,},
    { $pull: { users: userId }}, function(err, data) {
      if (err) res.render('error', { 
        message: 'Sorry failed to delete card id in users',
        error: { status: err, stacks: 'failed to delete card id in users' }
      });
      else{
        res.send({Response:'Deleted'})
      }
    }
  )

  });


  
//   router.patch('/remove-user-from-training/:_id', async (req,res) => {

// //Delete item in users
// User.findOneAndUpdate(
//   { '_id': req.params.id,},
//   { $pull: { users: req.params.id }}, function(err, data) {
//     if (err) res.render('error', { 
//       message: 'Sorry failed to delete card id in users',
//       error: { status: err, stacks: 'failed to delete card id in users' }
//     });
//   }
// )
// });


module.exports = router;
