
const PORT = process.env.PORT;
console.log(PORT);


const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require("./user");
require('dotenv').config();




// middleware
app.use(express.json());

// sessions
app.use(session({
    secret: process.env.SECRET,
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false, // default  more info: https://www.npmjs.com/package/express-session#resave
}));

//database setup
const mongoURI = process.env.MONGODBURI;
const db = mongoose.connection;

mongoose.connect(mongoURI, {
	useFindAndModify:false,
	useNewUrlParser:true,
	useUnifiedTopology: true
}, ()=>{
	console.log("database connection checked");
});

// set up listeners to monitor your database connection
db.once('open', ()=> console.log('DB connected...'));
db.on('error', (err)=> console.log(err.message));
db.on('disconnected', ()=> console.log('mongoose disconnected'));

//cors options
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

//setup cors
app.use(cors(corsOptions));

// HOMEPAGE message
app.get('/', (req, res) => {
  res.send('Connected');
});

//controllers
const usersController = require('./controllers/usersController');
app.use('/Users', usersController);

const sessionsController = require('./controllers/sessionsController');
app.use('/Sessions', sessionsController);

//listener
app.listen(PORT, () => {
  console.log('listening on port', PORT);
});
