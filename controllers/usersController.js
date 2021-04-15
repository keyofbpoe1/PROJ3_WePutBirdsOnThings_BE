const express = require('express');
const users = express.Router();
const bcrypt = require('bcrypt');

// require the model
const UsersModel = require('../models/usersModel');

//new Route


// USER CREATE ROUTE
users.post('/', (req, res)=>{
  console.log(req.body);

  // hashing and salting the password
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    //create user object in db
  UsersModel.create(req.body, (error, createdUser) => {
    if (error) {
      res.status(400).json({ error: error.message });
    }
    res.status(200).json(createdUser); //  .json() will send proper headers in response so client knows it's json coming back
  });
});

//pin bird Route

//general update Route
users.put('/:id', (req, res) => {
  UsersModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(updatedUser);
  });
});

//show and/or user search Route

//delete route
users.delete('/:id', (req, res) => {
  UsersModel.findByIdAndDelete(req.params.id, (error, deletedUser) => {
    if (error){
      res.status(400).json({ error: error.message });
    }
    else{
       res.status(200).json(deletedUser);
    }
  });
  req.session.destroy(() => {
    console.log('session destroyed');
    //res.redirect('/')
  });
});

module.exports = users;
