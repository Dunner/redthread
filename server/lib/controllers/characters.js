// lib/controllers/characters.js

var mongoose = require('mongoose'),
    Character = mongoose.model('Character');

// Find character by id and store it in the request
exports.character = function(req, res, next, id) {
  Character.findById(id, function(err, character) {
    if (err) return next(err);
    if (!character) return next();
    req.character = character;
    next();
  });
};

// List of characters
exports.query = function(req, res) {
  Character.find({ 'inStory': req.params.storyId }).sort('-createdAt').select('-content').limit(10).exec(function(err, characters) {
    if (err) return res.json(500, err);
    res.json(characters);
  });
};


// Create a character
exports.create = function(req, res) {
  var character = new Character(req.body);
  character.save(function(err) {
    if (err) return res.json(500, err);
    res.json(character);
  });
};


// Update a character
exports.update = function(req, res) {
  Character.update({ _id: req.character._id }, req.body, { }, function(err, updatedCharacter) {
    if (err) return res.json(500, err);
    res.json(updatedCharacter);
  });
};


// Remove a character
exports.remove = function(req, res) {
  var character = req.character;

  character.remove(function(err) {
    if (err) return res.json(500, err);
    res.json(character);
  });
};