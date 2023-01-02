var express = require('express');
var router = express.Router();
const Project = require('../models/project')
const User = require('../models/user.model')
const task = require('../models/task')


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


router.patch('/add-user-to-project/:id', async (req,res) => {
    let updatedProject = await Project.findById(req.params.id)
        updatedProject.members.push(req.body.members);
      
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


module.exports = router;
