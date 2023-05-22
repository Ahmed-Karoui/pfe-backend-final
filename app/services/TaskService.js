var express = require('express');
var router = express.Router();
const Task = require('../models/task');
const Project = require ('../models/project');
var nodemailer = require('nodemailer')
var handlebars = require('handlebars');
var fs = require('fs');
var mongoose = require('mongoose')
var User = require('../models/user.model')


router.post('/add-task', async (req,res) => {
    try{
        let task = new Task({
            name:req.body.name,
            description:req.body.description,
            status:req.body.status,
            member:req.body.member,
            due_date:req.body.due_date,
            creation_date:Date.now(),
            project:req.body.project,

        })
       let createdTask = await task.save() 
       res.status(201).json({
        status : 'Success',
        data : {
            createdTask
        }
    })
    }catch(err){
        console.log(err)
    }
})


router.get('/get-tasks',  (req,res) =>{
    Task.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


router.patch('/update-task/:id', async (req,res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                updatedTask
            }
          })
    }catch(err){
        console.log(err)
    }
})


router.delete('/delete-task/:id', async (req,res) => {
  const id = req.params.id
  await Task.findByIdAndRemove(id).exec()
  res.send('Deleted')
})


// router.get('/get-tasks-by-project/:Project/projects',  (req,res) =>{
//     let projectsfound  = Task.find({project:req.params.Project}).populate('projects').execPopulate;
//     console.log(projectsfound)
//     // res.json(projectsfound)
//     });


    router.get('/get-tasks-by-project/:Project', function(req, res) {
        Task.find({project:req.params.Project}).populate().exec(function(err, av) {
          if (err)
            res.send(err);
    
          res.json(av);
        });
      });


      router.get('/task/:id', (req, res, next) => {
        Task.findOne({
          _id: req.params.id
        }).then(
          (thing) => {
            res.status(200).json(thing);
          }
        ).catch(
          (error) => {
            res.status(404).json({
              error: error
            });
          }
        );
      });


    //   router.put('/task-validate/:id/:status', (req, res, next) => {
    //     Task.findByIdAndUpdate({"5db6b26730f133b65dbbe459"},{"breed": "Great Dane"}, function(err, result){
    //         if(err){
    //             res.send(err)
    //         }
    //         else{
    //             res.send(result)
    //         }
    

    router.route('/task-validate/:id').post(function(req,res){

        Task.findByIdAndUpdate({_id:req.params.id},{"status": "Completed"}, function(err, result){
    
            if(err){
                res.send(err)
            }
            else{
                res.send(result)
            }
    
        })
    })

    router.get('/get-users-informations/:id',  (req,res) =>{
      var id = mongoose.Types.ObjectId(req.params.id);
      FoundProject = Task.findOne({"_id":id} , (err,doc) => {
          if(err) console.log(err)
          //else console.log(doc)
          //console.log(doc.member)
          //res.send(err)
          User.findOne({"_id":doc.member} , (err1,doc1) => {
              if(err) console.log(err1)
              //else console.log(doc1)
              res.send(doc1)
      });
  });
  });


  router.post('/get-users-informations/',  (req,res) =>{
    let list = [];
    var ids = req.body.ids
    ids.forEach(element => {
      var id = mongoose.Types.ObjectId(element);
      console.log(id)
      FoundProject = Task.findOne({"_id":id} , (err,doc) => {
        if(err) console.log(err)
        User.findOne({"_id":doc.member} , (err1,doc1) => {
            if(err) console.log(err1)
            //console.log(doc1)
            //return doc1
          //  res.send(doc1)
          list.push(doc1)
          //console.log(list)
    });
    console.log(list)
});
    });
    res.send(list)
});


module.exports = router;
