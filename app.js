
require('dotenv/config')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const TelegramBot = require('node-telegram-bot-api');

// ENDPOINT
var indexRouter = require('./routes/index');

// TELEGRAM
const startCommand = require('./telegram');

// PUPPETEER
var talentaLogin = require('./puppeteer/talenta/login');

// CONFIG
const PORT = process.env.PORT || 3000;

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => console.log(`You are running on port ${PORT}!`));

const token = process.env.TELE_TOKEN;
const bot = new TelegramBot(token, {polling: true});
startCommand.defaultCommand(bot);

talentaLogin.login({
  username: process.env.USER_NAME, 
  password: process.env.USER_PASS
});

module.exports = app;
