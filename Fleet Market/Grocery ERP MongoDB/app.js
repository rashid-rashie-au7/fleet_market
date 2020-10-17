const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const userRouter = require('./routes/userRouter');
const sellerRouter = require('./routes/sellerhome');
const buyerRouter = require('./routes/buyerhome');

const app = express();

// Passport Config
require('./config/passport')(passport);

// To connect to DB
require('./database/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 15*60*1000 },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
  
);
// Connect flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  
  next();
});

app.use('/', userRouter);
app.use('/',sellerRouter);
app.use('/',buyerRouter);

app.use(passport.session());


module.exports = app;
