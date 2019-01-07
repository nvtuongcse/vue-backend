'use strict';

const mongoose = require('mongoose');

const opts = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  promiseLibrary: Promise,
  useNewUrlParser: true
};

mongoose.connect('mongodb://localhost:27017/vueapp', opts).then(async () => {
  console.log('MongoDB connected!');
}, err => {
  console.log(`MongoDB connection error ${err}`);
  if (err.message && err.message.code === 'ETIMEDOUT') {
    console.log('Retrying...');
    mongoose.connect(process.env.MONGO_URI, opts);
  }
});

mongoose.set('debug', true);

require('./model');