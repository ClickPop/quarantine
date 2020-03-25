// NPM Modules & Middleware
const createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  sassMiddleware = require('node-sass-middleware'),
  hbs = require('express-handlebars'),
  forceSecure = require('force-secure-express'),
  useragent = require('express-useragent');

// Routers
const indexRouter = require('./routes/index'),
  contributorsRouter = require('./routes/contributors'),
  activitiesRouter = require('./routes/activities'),
  likesRouter = require('./routes/likes');

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
app.use(useragent.express());

// Router Initialization
app.use('/', indexRouter);
app.use('/contributors', contributorsRouter);
app.use('/activities', activitiesRouter);
app.use('/likes', likesRouter);

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
