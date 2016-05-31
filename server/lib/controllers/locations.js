// lib/controllers/locations.js

var mongoose = require('mongoose'),
    Location = mongoose.model('Location');

// Find location by id and store it in the request
exports.location = function(req, res, next, id) {
  Location.findById(id, function(err, location) {
    if (err) return next(err);
    if (!location) return next();
    req.location = location;
    next();
  });
};

// List of locations
exports.query = function(req, res) {
  Location.find({ 'inStory': req.params.storyId }).sort('-createdAt').select('-content').limit(10).exec(function(err, locations) {
    if (err) return res.json(500, err);
    res.json(locations);
  });
};


// Create a location
exports.create = function(req, res) {
  var location = new Location(req.body);
  location.save(function(err) {
    if (err) return res.json(500, err);
    res.json(location);
  });
};


// Update a location
exports.update = function(req, res) {
  Location.update({ _id: req.location._id }, req.body, { }, function(err, updatedLocation) {
    if (err) return res.json(500, err);
    res.json(updatedLocation);
  });
};


// Remove a location
exports.remove = function(req, res) {
  var location = req.location;

  location.remove(function(err) {
    if (err) return res.json(500, err);
    res.json(location);
  });
};