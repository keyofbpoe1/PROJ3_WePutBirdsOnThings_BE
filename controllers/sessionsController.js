require('dotenv').config();
const express = require('express');
const sessions = express.Router();
//const bcrypt = require('bcrypt');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const keys = require("../../config/keys");
const SECRET = process.env.SECRET;

// require the model
const UsersModel = require('../models/usersModel');

//login GET Route

//login POST Route
sessions.post('/', (req, res) => {
  UsersModel.findOne({ username: req.body.username}, (err, foundUser) => {
    if (err) {
      res.send(err);
    }
    else {
      if (foundUser){
        //console.log(foundUser)
        if (bcrypt.compareSync(req.body.password, foundUser.password)){
          //login user and create session
          // User matched
          // Create JWT Payload
          const payload = {
            id: foundUser._id,
            name: foundUser.username,
          };
          // req.session.currentUser = foundUser;
          // res.redirect('/'); //got to start page...
          // Sign token
          jwt.sign(
            payload,
            SECRET,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                currentUser: foundUser._id,
              });
            }
          );
        }
        else{
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      }
      else{
        return res
          .status(404)
          .json({ userNotFound: "User not found" });
      }
    }
  });
});

//login POST Route
// sessions.post('/', (req, res) => {
//   UsersModel.findOne({ username: req.body.username}, (err, foundUser) => {
//     if (err) {
//       res.send(err);
//     }
//     else {
//       if (foundUser){
//         //console.log(foundUser)
//         if (bcrypt.compareSync(req.body.password, foundUser.password)){
//           //login user and create session
//           req.session.currentUser = foundUser;
//           res.redirect('/'); //got to start page...
//         }
//         else{
//           res.send("<h1>invalid password</h1>");
//         }
//       }
//       else{
//         res.send("<h1>user not found</h1>");
//       }
//     }
//   });
// });

//logout DELETE/destroy Route
sessions.get('/logout', (req, res) => {
  console.log(req.body);
  req.logout();
  return res
    .status(200)
    .json('Logged out!');


  // req.session.destroy(() => {
  //   res.redirect('/');
  // });
});

module.exports = sessions;
