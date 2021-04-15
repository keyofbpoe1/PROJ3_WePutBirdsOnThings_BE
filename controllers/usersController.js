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

//pin bird put Route
users.put('/:id/pin', (req, res) => {
  console.log(req.body);
  let pinUpd = { $push: { birdlist: {"birdname": req.body.bird, "seen": false } } };
  UsersModel.findByIdAndUpdate(req.params.id, pinUpd, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(updatedUser);
  });
});

//journal put route
users.put('/:id/journal', (req, res) => {
  console.log(req.body);
  let jUpd = { $push: { journal: {"notes": req.body.notes } } };
  UsersModel.findByIdAndUpdate(req.params.id, jUpd, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(updatedUser);
  });
});

//general update Route
users.put('/:id', (req, res) => {
  console.log(req.body);
  UsersModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(updatedUser);
  });
});

//show and/or user search Routes

//show or search all users
users.get('/', (req, res) => {
  let filterObj = {};

  //check for search
  if (req.query.search) {
    let patt = new RegExp(req.query.search, "gmi");
    if (!filterObj['$or']) {
      filterObj['$or'] = [];
    }
    filterObj['$or'].push(
      { username:  patt },
      { email: patt },
    );
  }

  //get users
  UsersModel.find(filterObj, (err, foundUsers, next) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(foundUsers);
  });
});

//show ONE user
users.get('/:id', (req, res) => {
  UsersModel.findById(req.params.id, (err, foundUser, next) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(foundUser);
  });
});

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
  //session destroy
  // req.session.destroy(() => {
  //   console.log('session destroyed');
  //   //res.redirect('/')
  // });
});

module.exports = users;
