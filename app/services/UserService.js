var express = require('express');
var router = express.Router();
const User = require('../models/user.model')
var jwt = require("jsonwebtoken");
const Project = require('../models/project');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require("dotenv").config();
const dbConfig = require("../config/db.config");
var bcrypt = require("bcryptjs");


router.post('/signup', async (req,res) => {
    try{
        let user = new User({
            name:req.body.name,
            last_name:req.body.last_name,
            email:req.body.email,
            Birth_date:req.body.Birth_date,
            Hire_date:req.body.Hire_date,
            role:req.body.role,
            gender:req.body.gender,
            manager:req.body.manager,
            phone:req.body.phone,
            status:req.body.status,
            password: bcrypt.hashSync(req.body.password, 8),
            creation_date:Date.now()
        })
       user.save ();
       
       res.status(201).json({
        status : 'Success',
        data : {
          user
        }
    })


    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          createdUser.roles = roles.map((role) => role._id);
          createdUser.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }


    }catch(err){
        console.log(err)
    }
})


router.get('/get-user',  (req,res) =>{
    User.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})

router.get('/get-managers',  (req,res) =>{
  User.find({role:"Manager"}, (err,result)=>{
      if(err){
          res.send(err)
      }
      res.send(result)
  })
})


router.patch('/update-user/:id', async (req,res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
              updatedUser
            }
          })
    }catch(err){
        console.log(err)
    }
})


router.delete('/delete-user/:id', async (req,res) => {
    const id = req.params.id
    await User.findByIdAndRemove(id).exec()
    res.status(200).json('deleted')
})


router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(501).json(err); console.log(user) }
    if (!user) { return res.status(501).json(info); console.log(user)}
    req.logIn(user, function(err) {
      return res.status(200).json({message:'Login Success'});
    });
  })(req, res, next);
});
  
  router.get('/user',isValidUser,function(req,res,next){
    return res.status(200).json(req.user);
  });
  
  router.get('/logout',isValidUser, function(req,res,next){
    req.logout();
    return res.status(200).json({message:'Logout Success'});
  })
  
  function isValidUser(req,res,next){
    if(req.isAuthenticated()) next();
    else return res.status(401).json({message:'Unauthorized Request'});
  }



  router.get('/get-user-byid/:id',  (req,res) =>{
    User.findById(req.params.id, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


router.get('/get-User-Info/:id', function(req, res) {
  ProjectFound = Project.findById(req.params.id);
  UserInfos = User.findById(ProjectFound.project_leader)
    res.json(UserInfos);
  });



  router.post('/reset-password', async (req, res) => {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ error: 'User not found' });
      }
  
      // Generate a unique token
      const token = jwt.sign({ id: user._id },dbConfig.JWT_KEY, {
        expiresIn: '1h',
      });
  
      // Save the token and the user's email address in the database
      user.resetPasswordToken = token;
      console.log(user.resetPasswordToken)
      user.resetPasswordExpires = Date.now() + 3600000;
      console.log(user.resetPasswordExpires)
      await user.save();
  
      // Send an email to the user's email address with a link that includes the unique token
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        
        auth: {
            user: "karouii.ahmed@gmail.com",
            pass: "pjoexguwpwbzcgvj"
          },
      });
      const mailOptions = {
        from: 'karouii.ahmed@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        text: `Please click on the following link to reset your password: http://localhost:4200/login/reset/${token}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Password reset email sent:', info.messageId);
      });
  
      res.status(200).send({ message: 'Password reset email sent' });
    });


    router.post('/update-password', async (req, res) => {
      try {
        const user = await User.findOne({
          resetPasswordToken: req.body.resetPasswordToken,
          resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
          return res.status(400).send({ error: 'Password reset token is invalid or has expired' });
        }
    
        // Hash the new password and save it in the database
        user.password = await bcrypt.hashSync(req.body.password,8)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    
        res.status(200).send({ message: 'Password updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while updating the password' });
      }
    });
  
  
  

module.exports = router;
