// models/character.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Todo Schema

var CharacterSchema = new Schema({
  name: String,
  appearance: String,
  inStory: String,
  createdAt: Date,
  updatedAt: Date,
});

// keep track of when characters are updated and created
CharacterSchema.pre('save', function(next, done){
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

mongoose.model('Character', CharacterSchema);