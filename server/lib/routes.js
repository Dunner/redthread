// lib/routes.js

'use strict';
var middleware = require('./middleware'),
    index = require('./controllers/index'),
    session = require('./controllers/session'),
    stories = require('./controllers/stories'),
    threads = require('./controllers/threads'),
    characters = require('./controllers/characters'),
    locations = require('./controllers/locations');

module.exports = function(app) {
  // Server API Routes
  // -------
  // Stories
  // -------
  app.get('/api/stories', stories.query);
  app.get('/api/stories/:slug', stories.show);
  app.post('/api/stories/:slug', stories.create);
  // -------
  // Session
  // -------
  app.get('/api/session', session.start); // START
  app.post('/api/session', session.login); // LOGIN
  app.delete('/api/session', session.logout); // LOGOUT
  // -------
  // Threads
  // -------
  app.param('threadId', threads.thread);
  app.get('/api/threads/:storyId', threads.query);
  app.get('/api/threads/:storyId/:threadId', threads.show);
  app.post('/api/threads', middleware.auth, threads.create);
  app.put('/api/threads/:threadId', middleware.auth, threads.update);
  app.delete('/api/threads/:threadId', middleware.auth, threads.remove);
  // -------
  // Characters
  // -------
  app.param('characterId', characters.character);
  app.get('/api/characters/:storyId', characters.query);
  app.post('/api/characters', middleware.auth, characters.create);
  app.put('/api/characters/:characterId', middleware.auth, characters.update);
  app.delete('/api/characters/:characterId', middleware.auth, characters.remove);
  // -------
  // Locations
  // -------
  app.param('locationId', locations.location);
  app.get('/api/locations/:storyId', locations.query);
  app.post('/api/locations', middleware.auth, locations.create);
  app.put('/api/locations/:locationId', middleware.auth, locations.update);
  app.delete('/api/locations/:locationId', middleware.auth, locations.remove);


  // -------
  // Other
  // -------
  // 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // -------
  // Protected
  // -------
  app.get('/user', middleware.auth);
  app.get('/users', middleware.auth);
  app.get('/settings', middleware.auth);


  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/views/*', index.views);
  app.get('/*', index.index);
};