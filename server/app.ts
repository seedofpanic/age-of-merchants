var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('client-sessions');

var routes = require('./routes/index');
var api = require('./routes/api');
var locales = require('./routes/locales');
var registration = require('./routes/registration');

// local libs
var game = require('./lib/game');
var auth = require('./lib/auth');

// config
var env = process.env.NODE_ENV || 'development';
var config = require('./config/app.json')[env];

var logger;
if (config.logger) {
  logger = require('morgan');
}

var app = express();

game.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// hook
function updateBreak(req, res, next) {
  if (game.updating) {
    res.send('<h1>Updating... Please try later...</h1>');
  } else {
    next();
  }
}
app.use(updateBreak);

//passport

app.use(session({
  cookieName: 'session',
  secret: config.session.secret,
  duration: config.session.duration,
  activeDuration: config.session.active_duration
}));
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (config.logger) {
  if (config.logger_mode == 'files') {
    var logDirectory = __dirname + '/log';

    var fs = require('fs');
    // ensure log directory exists
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    var FileStreamRotator = require('file-stream-rotator');
    // create a rotating write stream
    var accessLogStream = FileStreamRotator.getStream({
      filename: logDirectory + '/access-%DATE%.log',
      frequency: 'daily',
      date_format: "YYYYMMDD",
      verbose: false
    });
    console.log = function (msg) {
      accessLogStream.write('[' + new Date() + '] ' + msg + '\n');
    };
    app.use(logger('combined', {stream: accessLogStream}))
  } else {
    app.use(logger(config.logger));
  }
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/libs', express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/api', api);
app.use('/locales', locales);
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/#/auth'}));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.use('/registration', registration);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({err: err});
  });
} else {
// production error handler
// no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({error: ''});
  });
}

export default app;
