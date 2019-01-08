'use strict';

const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const expressGraphQL = require('express-graphql');
const logger = require('morgan');
require('./mongooseConnecntion.js');
const { graphqlSchema } = require('./schema');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
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