const express = require('express');
const sessions = express.Router();
const bcrypt = require('bcrypt');

// require the model
const UsersModel = require('../models/usersModel');

//login GET Route

//login POST Route
sessions.post('/', (req, res) => {
  console.log(req.body);
  UsersModel.findOne({ username: req.body.username}, (err, foundUser) => {
    if (err) {
      res.send(err);
    }
    else {
      if (foundUser){
        //console.log(foundUser)
        if (bcrypt.compareSync(req.body.password, foundUser.password)){
          //login user and create session
          req.session.currentUser = foundUser;
          res.redirect('/'); //got to start page...
        }
        else{
          res.send("<h1>invalid password</h1>");
        }
      }
      else{
        res.send("<h1>user not found</h1>");
      }
    }
  });
});

//logout DELETE/destroy Route
sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = sessions;
