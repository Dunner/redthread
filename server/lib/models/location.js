// models/location.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Todo Schema

var LocationSchema = new Schema({
  name: String,
  appearance: String,
  inStory: String,
  createdAt: Date,
  updatedAt: Date,
});

// keep track of when locations are updated and created
LocationSchema.pre('save', function(next, done){
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

mongoose.model('Location', LocationSchema);