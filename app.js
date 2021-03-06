const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const hbs = require('express-handlebars');
const forceSecure = require('force-secure-express');

const indexRouter = require('./routes/index');
const contributorsRouter = require('./routes/contributors');
const activitiesRouter = require('./routes/activities');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutDir: path.join(__dirname, 'views', 'layouts'), // for layouts
    partialsDir: [
      path.join(__dirname, 'views', 'partials')
    ],
    helpers: require('./config/handlebars-helpers')
  })
);

app.use(forceSecure([
  'thingstodowhentheworldgetscanceled.com',
  'world-canceled-production.herokuapp.com',
  'world-canceled-staging.herokuapp.com'
]));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: false
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/contributors', contributorsRouter);
app.use('/activities', activitiesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
