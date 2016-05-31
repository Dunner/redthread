// models/thread.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Todo Schema

var ThreadSchema = new Schema({
  increment: Number,
  text: String,
  choices: [
    {
      text: String,
      toThread: String
    }
  ],
  pos: {
    x: Number,
    y: Number
  },
  prompt: String,
  character: String,
  location: String,
  toThread: String,
  inStory: String,
  createdAt: Date,
  updatedAt: Date,
});

// keep track of when threads are updated and created
ThreadSchema.pre('save', function(next, done){
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

mongoose.model('Thread', ThreadSchema);