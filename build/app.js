'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressGraphQL = require('express-graphql');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
require('./mongooseConnecntion.js');
const { graphqlSchema } = require('./schema');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/graphql', expressGraphQL(request => ({
  schema: graphqlSchema,
  graphiql: true,
  context: {
    request
  },
  formatError: error => ({
    message: error.message,
    state: error.originalError && error.originalError.state,
    locations: error.locations,
    path: error.path
  })
})));
app.post('/graphql', expressGraphQL(request => ({
  schema: graphqlSchema,
  graphiql: true,
  context: {
    request,
    startTime: Date.now()
  },
  formatError: error => ({
    code: error.code,
    type: error.type,
    message: error.message
  })
})));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;