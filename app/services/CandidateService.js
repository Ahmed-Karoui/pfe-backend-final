var express = require('express');
var router = express.Router();
const User = require('../models/user.model')
const Candidate = require('../models/candidate')
var jwt = require("jsonwebtoken");
const Appraisal = require('../models/appraisal');


router.post('/signup', async (req,res) => {
    try{
        let user = new Candidate({
            // name:String,
            // email: String,
            // password: String,
            // last_name: String,
            // Birth_date: Date,
            // gender: String,
            // phone: String,
            // creation_date: Date,
            // status:String,
            // test_status:String,
            // departement:String,
            // irt_score:Number,
            // psy_score:Number,
            // tech_test:Number
            name:req.body.name,
            last_name:req.body.last_name,
            email:req.body.email,
            Birth_date:req.body.Birth_date,
            gender:req.body.gender,
            phone:req.body.phone,
            status:req.body.status,
            password: bcrypt.hashSync(req.body.password, 8),
            creation_date:Date.now(),
            test_status:req.body.status,
            departement:req.body.departement,
            irt_score:req.body.irt_score,
            psy_score:req.body.psy_score,
            tech_test:req.body.tech_test,

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


router.get('/get-candidates',  (req,res) =>{
  Candidate.find({}, (err,result)=>{
      if(err){
          res.send(err)
      }
      res.send(result)
  })
})

router.get('/get-user',  (req,res) =>{
    User.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})

router.get('/get-candidates-testing',  (req,res) =>{
    Candidate.find({status:"Selected For tests"}, (err,result)=>{
      if(err){
          res.send(err)
      }
      res.send(result)
  })
})


router.get('/get-candidates-interviewing',  (req,res) =>{
    Candidate.find({status:"interviewing"}, (err,result)=>{
      if(err){
          res.send(err)
      }
      res.send(result)
  })
})


router.get('/get-candidates-offered',  (req,res) =>{
    Candidate.find({status:"offered"}, (err,result)=>{
      if(err){
          res.send(err)
      }
      res.send(result)
  })
})


router.get('/get-candidates-rejected',  (req,res) =>{
    Candidate.find({status:"rejected"}, (err,result)=>{
      if(err){
          res.send(err)
      }
      res.send(result)
  })
})


router.get('/get-candidates-accepted',  (req,res) =>{
  Candidate.find({status:"accepted"}, (err,result)=>{
    if(err){
        res.send(err)
    }
    res.send(result)
})
})


router.patch('/update-candidate/:id', async (req,res) => {
    const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
              updatedCandidate
            }
          })
    }catch(err){
        console.log(err)
    }
})


router.patch('/update-user-irt/:id', async (req,res) => {
    const updatedUser = await Candidate.findByIdAndUpdate(req.params.id,req.body,{
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


router.patch('/change-candidate-status/:id', async (req,res) => {
  const validatedCandidate = await Candidate.findByIdAndUpdate(req.params.id,req.body,{
      new : true,
      runValidators : true
    })
  try{
      res.status(200).json({
          status : 'Success',
          data : {
            validatedCandidate
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


  router.get('/getupdatedUser/:id',  (req,res) =>{
    Candidate.findOne(req.body.id, (err,result)=>{
      if(err){
          res.send(err)
      }
      res.send(result)
  })
  })


module.exports = router;
