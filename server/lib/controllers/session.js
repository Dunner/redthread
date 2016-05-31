'use strict';

var mongoose = require('mongoose'),
    Story = mongoose.model('Story');
    
/**
 * Start
 */
exports.start = function (req, res, next) {
  if(req.session.authenticated) {
    return res.json(200, {'status': true});
  } else {
    return res.json({'status': false});
  }
};

/**
 * Logout
 */
exports.logout = function (req, res, next) {
  req.session.destroy();
  res.send(201);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  var where = req.body.story;
  var password = req.body.password;
  if (password){
    Story.findOne({ 'slug': req.body.story }).exec(function (err, story) {
      if (!story.validPassword(password)) {
        console.log('failed login with password: '+password);
        return res.send(401, {'status':'Wrong Password'});
      } else {
        // req.session.password = story.generateHash(password);
        req.session.authenticated = true;
        return res.send(200);
      }
    });
  }
};