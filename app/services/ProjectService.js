var express = require('express');
var router = express.Router();
const Project = require('../models/project')
const User = require('../models/user.model')
const task = require('../models/task')
const mongoose = require('mongoose');
const Training = require('../models/training');



router.post('/add-project', async (req,res) => {
    try{
        let user = new Project({
            project_name:req.body.project_name,
            description:req.body.description,
            project_leader:req.body.project_leader,
            members:req.body.members,
            status:req.body.status,
            Deadline:req.body.Deadline,
            category:req.body.category,
            creation_date:Date.now()
        })
       let createdProject = await user.save() 
       res.status(201).json({
        status : 'Success',
        data : {
            createdProject
        }
    })
    }catch(err){
        console.log(err)
    }
})


router.get('/get-projects',  (req,res) =>{
     Project.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
         res.send(result)
     })
 })


router.post('/add-user-to-project/:id', async (req,res) => {
    
    console.log(req.body.member)
    console.log(req.params.id)
    let foundproject = await Project.findById(req.params.id)
    console.log(foundproject)  
    //foundproject.members.push({_id:"639778588fab7c39c03bedfd"})
    let members = await Project.updateMany({ '_id': req.params.id }, { $push: { members: req.body.member } });
   // await User.updateMany({ '_id': training.users }, { $push: { users: training._id } });
   res.send(members)

    
    });


    router.patch('/add-manager-to-project/:id', async (req,res) => {
        let updatedProject = await Project.findById(req.params.id)
        var project_leader = req.body.project_leader;
        project_leader2 = project_leader.toString();
        updatedProject.project_leader = project_leader2
        try{
            let finalupdate =  await updatedProject.save()
            res.status(200).json({
                status : 'Success',
                data : {
                    finalupdate
                }
              })
        }catch(err){
            console.log(err)
        }
        });
    


router.delete('/delete-project/:id', async (req,res) => {
    const id = req.params.id
    await Project.findByIdAndRemove(id).exec()
    res.send('Deleted')
})


router.get('/get-tasks-by-project/:Project',  (req,res) =>{
    let projectsfound  = Project.find({project:req.params.Project}).populate('tasks');
    console.log(projectsfound)
    });



    router.patch('/update-project/:id', async (req,res) => {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators : true
          })
        try{
            res.status(200).json({
                status : 'Success',
                data : {
                    updatedProject
                }
              })
        }catch(err){
            console.log(err)
        }
    })


    router.get('/get-users-by-project/:project',  (req,res) =>{
        usersfound = Project.find(Project.members);
        console.log(usersfound);
    
    });


 router.get('/get-manager-informations-final/:id',  (req,res) =>{
 Project.findById(req.params.id).populate('project_leader').exec(function (err, project) {
    if (err) return handleError(err);
    console.log('The author is %s', project.project_leader.name);
    // prints "The author is Ian Fleming"
  });
})




router.get('/get-manager-informations/:id',  (req,res) =>{
    var id = mongoose.Types.ObjectId(req.params.id);
    FoundProject = Project.findOne({"_id":id} , (err,doc) => {
        if(err) console.log(err)
        //else console.log(doc)
       // console.log(doc.project_leader)
        //res.send(err)
        User.findOne({"_id":doc.project_leader} , (err1,doc1) => {
            if(err) console.log(err1)
            //else console.log(doc1)
            res.send(doc1)
    });
});
});


router.get('/get-users-informations/:id',  (req,res) =>{
    var id = mongoose.Types.ObjectId(req.params.id);
    FoundProject = Project.findOne({"_id":id} , (err,doc) => {
        if(err) console.log(err)
        //else console.log(doc)
       // console.log(doc.project_leader)
        //res.send(err)
        User.find({"_id":doc.members} , (err1,doc1) => {
            if(err) console.log(err1)
            //else console.log(doc1)
            res.send(doc1)
    });
});
});


module.exports = router;
