const mongoose = require('mongoose');
const {Schema, model} =  mongoose;

const usersSchema = new Schema({
	username: {type: String, required:true, unique:true},
	password: {type: String, required:true},
  email: {type: String, required:true, unique:true},
	about: String,
  birdlist: Array, //array of objects {birdname (string), seen (boolean)}
  journal: Array, //potential array of journal objects with text, location, bird photos, title, etc...
});

module.exports = model('User', usersSchema);
