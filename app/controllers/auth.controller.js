const config = require("../config/auth.config");
const db = require("../models");
const multer = require('multer');
const User = db.user;
const Role = db.role;
var express = require('express');  
var app = express();
const Candidate = db.candidate
var nodemailer = require('nodemailer')
var handlebars = require('handlebars');
var fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

// default options
app.use(fileUpload());


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
  host: "smtp.gmail.com",
  port: 587,
  
  auth: {
      user: "karouii.ahmed@gmail.com",
      pass: "pjoexguwpwbzcgvj"
    }
}));


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { candidate } = require("../models");


exports.signup = (req, res) => {

  let sampleFile;
  let uploadPath;


  const url = req.protocol + '://'+ req.get('host');
  const user = new User({
    name:req.body.name,
    last_name:req.body.last_name,
    email:req.body.email,
    Birth_date:req.body.Birth_date,
    Hire_date:req.body.Hire_date,
    gender:req.body.gender,
    role:req.body.role,
    manager:req.body.manager,
    phone:req.body.phone,
    status:req.body.status,
    password: bcrypt.hashSync(req.body.password, 8),
    creation_date:Date.now(),
    days_off:0,
    sampleFile : req.files.sampleFile.name

  
  });

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    uploadPath = __dirname + '/uploads/' + req.files.sampleFile.name;
    console.log(req.files.sampleFile.name)
  
    // Use the mv() method to place the file somewhere on your server
    req.files.sampleFile.mv(uploadPath)
  

  readHTMLFile('C:/Users/admin/Desktop/Back End PFE/node-js-express-login-mongodb/app/public/RegistrationMail.html', function(err, html) {
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
        to: req.body.email,
        subject: 'test auth',
        html : htmlToSend
     };

     transport.sendMail(mailOptions, function (error, response) {
      if (error) {
          console.log(error);
      }
  });
  
  });
  
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

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

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
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
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        email: user.email,
        roles: authorities,
        name:req.body.name,
        last_name:user.last_name,
        name:user.name,
        Birth_date:user.Birth_date,
        Hire_date:user.Hire_date,
        gender:user.gender,
        role:user.role,
        manager:user.manager,
        phone:user.phone,
        status:user.status,
        creation_date : user.creation_date,
        days_off : user.days_off,
        sampleFile:user.sampleFile,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.signincandidate = (req, res) => {
  candidate.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, candidate) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!candidate) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        candidate.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: candidate.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      // for (let i = 0; i < candidate.roles.length; i++) {
      //   authorities.push("ROLE_" + candidate.roles[i].name.toUpperCase());
      // }

      req.session.token = token;

      res.status(200).send({
        id: candidate._id,
        email: candidate.email,
        roles: authorities,
        name:req.body.name,
        last_name:candidate.last_name,
        Birth_date:candidate.Birth_date,
        gender:candidate.gender,
        phone:candidate.phone,
        status:candidate.phone,
        test_status:candidate.test_status,
        departement:candidate.departement,
        irt_score:candidate.irt_score,
        psy_score:candidate.psy_score,
        tech_test:candidate.tech_test,
        irt_test_status:candidate.irt_test_status,
        psy_test_status:candidate.psy_test_status,
        tech_test_status:candidate.tech_test_status,
      });
    });
};

exports.signupcandidate = (req, res) => {

  const candidate = new Candidate({
    name:req.body.name,
    last_name:req.body.last_name,
    email:req.body.email,
    Birth_date:req.body.Birth_date,
    gender:req.body.gender,
    phone:req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8),
    creation_date:Date.now(),
    status:'Selected For tests',
    test_status:"not_started",
    departement:req.body.departement,
    irt_score:req.body.irt_score,
    psy_score:req.body.psy_score,
    tech_test:req.body.tech_test,
    irt_test_status:'not completed',
    psy_test_status:'not completed',
    tech_test_status:'not completed',
  });

  candidate.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

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

          candidate.roles = roles.map((role) => role._id);
          user.save((err) => {
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

        candidate.roles = [role._id];
        candidate.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
