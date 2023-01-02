var express = require('express');
var router = express.Router();
const Leave = require('../models/leave')
var nodemailer = require('nodemailer')
var handlebars = require('handlebars');
var fs = require('fs');
var User = require('../models/user.model')


var readHTMLFile = function(path, callback) {
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


readHTMLFile('C:/Users/Ahmed/Desktop/Test AUthentification PFE - Copy/node-js-express-login-mongodb/app/public/emailWithPDF.html', function(err, html) {
    if (err) {
       console.log('error reading file', err);
       return;
    }
    var template = handlebars.compile(html);
    var replacements = {
         username: "John Doe"
    };
    let htmlToSend = template(replacements);

    mailOptions = {
        from: '"Planisware MIS Team" <karouii.ahmed@gmail.com>',
        to: 'karouii.ahmed@gmail.com',
        subject: 'A New Leave Request has been submitted',
        html : htmlToSend
     };

});



router.post('/add-leave', async (req,res) => {
    try{
        let leave = new Leave({
            title:req.body.title,
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            user:req.body.user,
            status:req.body.status,
            owner:req.body.owner
        })
        //var nb_days = end_date - start_date;
        //console.log(nb_days)
       // User.findByIdAndUpdate({_id:req.body.owner},{"days_off": days_off - })
       let createdLeave = await leave.save()
       console.log(mailOptions)
       transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        }
    });
       res.status(201).json({
        status : 'Success',
        data : {
            createdLeave
        }
    
    })
    }catch(err){
        console.log(err)
    }
})


router.get('/get-leaves',  (req,res) =>{
    Leave.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


router.patch('/update-leave/:id', async (req,res) => {
    const updatedLeave = await Leave.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                updatedLeave
            }
          })
    }catch(err){
        console.log(err)
    }
})


router.delete('/delete-leave/:id', async (req,res) => {
    const id = req.params.id
    await Leave.findByIdAndRemove(id).exec()
    res.send('Deleted')
})


router.get('/get-unvalidated-Leaves',  (req,res) =>{
    Leave.find({status:"Waiting For Approval"}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
  })


  router.route('/validate-leave/:id').post(function(req,res){

    Leave.findByIdAndUpdate({_id:req.params.id},{"status": "Validated"}, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
})



router.route('/reject-leave/:id').post(function(req,res){

    Leave.findByIdAndUpdate({_id:req.params.id},{"status": "Rejected"}, function(err, result){

        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }

    })
})


module.exports = router;
