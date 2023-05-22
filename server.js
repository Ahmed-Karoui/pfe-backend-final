const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
multer   = require('multer')
const fileUpload = require('express-fileupload');








const dbConfig = require("./app/config/db.config");

const app = express();

// default options
app.use(fileUpload());

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use('/images' , express.static('images'));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bouhmid-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


// Make "public" Folder Publicly Available
app.use('/public', express.static('public'))

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// Attaching Routing To Service Classes
var usersRouter = require('./app/services/UserService');
var projectsRouter = require('./app/services/ProjectService');
var tasksRouter = require('./app/services/TaskService');
var appraisalsRouter = require('./app/services/AppraisalService');
var leavesRouter = require('./app/services/LeaveService');
var ticketsRouter = require('./app/services/TicketService');
var trainingsRouter = require('./app/services/TrainingService')
var testsRouter = require('./app/services/TestService');
var candidatesRouter = require('./app/services/CandidateService');



//Routing implementation
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);
app.use('/appraisals', appraisalsRouter);
app.use('/leaves', leavesRouter);
app.use('/trainings', trainingsRouter);
app.use('/tickets', ticketsRouter);
app.use('/tests', testsRouter);
app.use('/candidates', candidatesRouter);


