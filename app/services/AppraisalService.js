var express = require('express');
const Appraisal = require('../models/appraisal');
var router = express.Router();
const appraisal = require('../models/appraisal');
var User = require('../models/user.model')
var mongoose = require('mongoose')

//mailing config 

var nodemailer = require('nodemailer')
var handlebars = require('handlebars');
var fs = require('fs');


var readHTMLFileAppraisal = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
           callback(err);                 
        }
        else {
            callback(null, html);
        }
    });
};



transport = nodemailer.createTransport(({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    
    auth: {
      user: "karouii.ahmed@gmail.com",
      pass: "DgPGL3nQSZYrBVad"
    }
}));

  router.post('/add-appraisal', async (req,res) => {
    var dateget = new Date(req.body.previous_date);
    var datetest = dateget.setFullYear(dateget.getFullYear()+1);
   // datetest.setFullYear(datetest.getFullYear() + 1)

    try{
        const obj = new appraisal({
            user_name:req.body.user_name,
            user_id:req.body.user_id,
            previous_date:req.body.previous_date,
            departement:req.body.departement,
            user_email:req.body.user_email,
            Next_date:datetest,
            evaluator:req.body.evaluator_id,
            objectif1_status:"Refused",
            objectif2_status:"Refused",
            objectif2_status:"Refused"
            
        })
        readHTMLFileAppraisal('C:/Users/admin/Desktop/Back End PFE/node-js-express-login-mongodb/app/public/emailAppraisal.html', function(err, html) {
            if (err) {
               console.log('error reading file', err);
               return;
            }
            console.log("body",req.body)
            var template = handlebars.compile(html);
            var replacements = {
                 username: "John Doe"
            };
            let htmlToSend = template(replacements);
          
            var mailOptions = {
                from: '"Planisware MIS Team" <karouii.ahmed@gmail.com>',
                to: req.body.user_mail,
                subject: 'test auth',
                html : htmlToSend
             };

             console.log("email test",req.body.user_mail)
            
             transport.sendMail(mailOptions, function (error, response) {
              if (error) {
                  console.log(error);
              }
          });
     });
        let obj2 = await obj.save() 
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
        new : false,
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

router.get('/get-user-evaluator-infos',  (req,res) =>{
    Appraisal.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


router.get('/get-evaluator-informations/:id',  (req,res) =>{
    var id = mongoose.Types.ObjectId(req.params.id);
    FoundAppraisal = Appraisal.findOne({"_id":id} , (err,doc) => {
        if(err) console.log(err)
        //else console.log(doc)
       // console.log(doc.project_leader)
        //res.send(err)
        User.findOne({"_id":doc.evaluator} , (err1,doc1) => {
            if(err) console.log(err1)
            //else console.log(doc1)
            res.send(doc1)
    });
});
});


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


module.exports = router;
