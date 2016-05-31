// lib/controllers/threads.js

var mongoose = require('mongoose'),
    Thread = mongoose.model('Thread'),
    Story = mongoose.model('Story');

// Find thread by id and store it in the request
exports.thread = function(req, res, next, id) {
  Thread.findById(id, function(err, thread) {
    if (err) return next(err);
    if (!thread) return next();
    req.thread = thread;
    next();
  });
};

// List of threads
exports.query = function(req, res) {
  Thread.find({ 'inStory': req.params.storyId }).sort('-createdAt').select('-content').limit(10).exec(function(err, threads) {
    if (err) return res.json(500, err);
    res.json(threads);
  });
};

// Show a thread
exports.show = function(req, res) {
  Thread.findById(req.params.threadId, function (err, thread) {
    if(err) { return res.send(err); }
    if(!thread) { return res.send(404); }
    return res.json(200, {'content':thread.content});
  });
};

// Create a thread
exports.create = function(req, res) {
  var thread = new Thread(req.body);
  Story.findById(thread.inStory, function (err, story) {
    thread.increment = story.threadIncrement++;
    thread.save(function(err) {
      if (err) return res.json(500, err);
      story.save();
      res.json(thread);
    });
    
  });



};


// Update a thread

exports.update = function(req, res) {
  Thread.update({ _id: req.thread._id }, req.body, { }, function(err, updatedThread) {
    if (err) return res.json(500, err);
    res.json(updatedThread);
  });
};


// Remove a thread

exports.remove = function(req, res) {
  var thread = req.thread;

  thread.remove(function(err) {
    if (err) return res.json(500, err);
    res.json(thread);
  });
};