const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const expressGraphQL = require('express-graphql');
const logger = require('morgan');
const debug = require('debug')('backend-vue:server');
const http = require('http');
require('./mongooseConnecntion.js');
const path = require('path');

const app = express();
const server = http.createServer(app);

module.exports = server;
require('./socketIO');

const { graphqlSchema } = require('./schema');

const port = process.env.PORT || '3000';
app.set('port', port);
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get(
  '/graphql',
  expressGraphQL(request => ({
    schema: graphqlSchema,
    graphiql: true,
    context: {
      request,
    },
    formatError: error => ({
      message: error.message,
      state: error.originalError && error.originalError.state,
      locations: error.locations,
      path: error.path,
    }),
  })),
);
app.post(
  '/graphql',
  expressGraphQL(request => ({
    schema: graphqlSchema,
    graphiql: true,
    context: {
      request,
      startTime: Date.now(),
    },
    formatError: error => ({
      code: error.code,
      type: error.type,
      message: error.message,
    }),
  })),
);

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

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
