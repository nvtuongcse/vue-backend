require('dotenv').config();
const mongoose = require('mongoose');

const opts = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  promiseLibrary: Promise,
  useNewUrlParser: true,
};

mongoose
  .connect(
    process.env.MONGO_URI,
    opts,
  )
  .then(
    async () => {
      console.log('MongoDB connected!');
    },
    (err) => {
      if (err.message && err.message.code === 'ETIMEDOUT') {
        mongoose.connect(process.env.MONGO_URI, opts);
      }
    },
  );

mongoose.set('debug', false);

require('./model');
