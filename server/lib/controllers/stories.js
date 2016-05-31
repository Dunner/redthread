// lib/controllers/stories.js

var mongoose = require('mongoose'),
    Story = mongoose.model('Story');

// List of story
exports.query = function(req, res) {
  Story.find().sort('-createdAt').select('-password').limit(10).exec(function(err, stories) {
    if (err) return res.json(500, err);
    res.json(stories);
  });
};

// Show a story
exports.show = function(req, res) {
  Story.findOne({ 'slug': req.params.slug }).select('-password').exec(function(err, story) {
    if (err) return res.json(500, err);
    res.json(story);
  });
};

// Create a story
exports.create = function(req, res) {
  var story = new Story(req.body);
  story.password = story.generateHash(story.password);
  story.threadIncrement = 0;
  story.save(function(err) {
    if (err) return res.json(500, err);
    res.json(story);
  });
};
