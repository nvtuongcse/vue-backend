const mongoose = require('mongoose');
require('dotenv');

const opts = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  promiseLibrary: Promise,
  useNewUrlParser: true,
};

mongoose
  .connect(
    'mongodb+srv://vue-app-2409:vueapp2409@cluster0-mjbso.mongodb.net/vueapp',
    opts,
  )
  .then(
    async () => {
      console.log('MongoDB connected!');
    },
    (err) => {
      console.log(`MongoDB connection error ${err}`);
      if (err.message && err.message.code === 'ETIMEDOUT') {
        console.log('Retrying...');
        mongoose.connect(process.env.MONGO_URI, opts);
      }
    },
  );

// mongoose.set('debug', true);

require('./model');
