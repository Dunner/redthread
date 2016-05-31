// server.js

  // modules =================================================
  var express        = require('express');
  var fs             = require('fs');
  var app            = express();
  var ip             = process.env.IP || '0.0.0.0';
  var port           = process.env.PORT || 8080;
  var env            = process.env.NODE_ENV || 'development';
  var server         = require('http').createServer(app);
  var path           = require('path');
  var mongoose       = require('mongoose');
  var ejs            = require('ejs');

  var bodyParser     = require('body-parser');
  var cookieParser   = require('cookie-parser');
  var morgan         = require('morgan');
  var errorHandler   = require('errorhandler');
  var methodOverride = require('method-override');
  var session        = require('express-session');
  var mongoStore     = require('connect-mongo')(session);
  var db             = require('./config/db');

  var root           = path.join(__dirname, '../client')

  // configuration ===========================================

  // Models
  var modelsPath = path.join(__dirname, 'lib/models');
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
      require(modelsPath + '/' + file);
    }
  });

  // Connect to db with mongoose, uri in config/db.js
  mongoose.connect(db.url); // From config

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(root, '.tmp')));
    app.use(express.static(path.join(root, 'app')));
    app.use('/bower_components',  express.static(path.join(root, 'bower_components')));
    app.set('views', root + '/app/');
    app.use(require('prerender-node').set('prerenderToken', 'ozMxCNCX2hXkfZo6swel'));

  app.use(morgan('dev')); // Logg stuff
  // get all data/stuff of the body (POST) parameters
  app.use(cookieParser()); // parse cookies
  app.use(bodyParser.urlencoded({'extended':'true'}));      // parse application/x-www-form-urlencoded
  app.use(bodyParser.json());                   // parse application/json
  app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
  app.use(methodOverride());

  // Persist sessions with mongoStore
  app.use(session({
    secret: 'storytime',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      url: db.url,
      collection: 'sessions',
    }, function () {
        console.log("db connection open");
    })
  }));
  
  // Populate empty DB with sample data
  //require('./config/dummy');
  
  // routes ==================================================
  require('./lib/routes')(app); // configure API routes
  // start app ===============================================
  server.listen(port, function () {
    console.log('Express server listening on %d, in %s mode', port, app.get('env'));
  });

  exports = module.exports = app;             // expose app
