const express = require('express');
const users = express.Router();

// require the model
const UsersModel = require('../models/usersModel');


module.exports = users;
