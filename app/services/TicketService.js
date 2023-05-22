var express = require('express');
var router = express.Router();
const Ticket = require('../models/ticket')
var nodemailer = require('nodemailer')
var handlebars = require('handlebars');
var fs = require('fs');
var mongoose = require('mongoose')
var User = require('../models/user.model')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
var app = express();
const path = require('path');
const fileUpload = require('express-fileupload');

// default options
app.use(fileUpload());


var readHTMLFileTicket = function(path, callback) {
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
    host: "smtp.gmail.com",
    port: 587,
    
    auth: {
        user: "karouii.ahmed@gmail.com",
        pass: "pjoexguwpwbzcgvj"
      }
}));


router.post('/add-ticket', async (req,res) => {
    try{
        let ticket = new Ticket({
            description:req.body.description,
            category:req.body.category,
            urgency:req.body.urgency,
            departement:req.body.departement,
            creation_date:Date.now(),
            estiamte_date:req.body.estiamte_date,
            user:req.body.user,
            status:req.body.status,
            content:req.body.content,
            user: req.body.user,
            sampleFile : req.files.sampleFile.name
            
               })

               if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
              }
              else{
                
                    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                    uploadPath = __dirname + '/uploads/' + req.files.sampleFile.name;
                    console.log(req.files.sampleFile.name)
                  
                    // Use the mv() method to place the file somewhere on your server
                    req.files.sampleFile.mv(uploadPath)
              }
            
       let createdTicket = await ticket.save() 
       res.status(201).json({
        status : 'Success',
        data : {
            createdTicket
        }
    })
    }catch(err){
        console.log(err)
    }
})


router.get('/get-tickets',  (req,res) =>{
    Ticket.find({}, (err,result)=>{
        if(err){
            res.send(err)
        }
        res.send(result)
    })
})


router.patch('/update-ticket/:id', async (req,res) => {
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                updatedTicket
            }
          })
    }catch(err){
        console.log(err)
    }
})


router.delete('/delete-ticket/:id', async (req,res) => {
    const id = req.params.id
    await Ticket.findByIdAndRemove(id).exec()
    res.json('Deleted')
})


router.patch('/validate-ticket/:id', async (req,res) => {
    const validatedTicket = await Ticket.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        readHTMLFileTicket('C:/Users/admin/Desktop/Back End PFE/node-js-express-login-mongodb/app/public/MailTicket.html', function(err, html) {
            if (err) {
               console.log('error reading file', err);
               return;
            }
            var template = handlebars.compile(html);
            var replacements = {
                 username: "John Doe"
            };
            let htmlToSend = template(replacements);
          
            var mailOptions = {
                from: '"Planisware MIS Team" <karouii.ahmed@gmail.com>',
                to: req.body.usermail,
                subject: 'test auth',
                html : htmlToSend
             };
        
             transport.sendMail(mailOptions, function (error, response) {
              if (error) {
                  console.log(error);
              }
          });
          
          });
        res.status(200).json({
            status : 'Success',
            data : {
                validatedTicket
            }
          })
    }catch(err){
        console.log(err)
    }
})

router.get('/get-users-by-ticket/:Ticket',  (req,res) =>{
    let usersFound  = Ticket.findById(req.body.Ticket).populate('user').exec();
    console.log(usersFound)
    });



    router.get('/get-user-informations/:id',  (req,res) =>{
        var id = mongoose.Types.ObjectId(req.params.id);
        FoundTicket = Ticket.findOne({"_id":id} , (err,doc) => {
            if(err) console.log(err)
            //else console.log(doc)
            //console.log(doc.user)
            //res.send(err)
            User.findOne({"_id":doc.user} , (err1,doc1) => {
                if(err) console.log(err1)
                else 
                res.send(doc1)
        });
    });
    });

module.exports = router;
