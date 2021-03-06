'use strict';

const { ROOT, DB_URI } = require('../../config');

const glob     = require('glob');
const doWhilst = require('async/doWhilst');
const mongoose = require('mongoose');

module.exports = (done) => {

  mongoose.Promise = global.Promise;

  const disconnected  = 0;
  const connected     = 1;
  const connecting    = 2;
  const disconnecting = 3;
  const connection    = mongoose.connection;
  const state         = connection.readyState;

  if (state === connected || state === connecting ) {
    return done();
  }

  mongoose.connect(DB_URI, {useMongoClient: true});
  connection
    .on('connected', () => {
      glob
        .sync(`${ROOT}/app/models/*.js`)
        .forEach(model => require(model));
      done();
    });

  connection
    .on('error', (err) => {
      throw new Error(`unable to connect to database, ${DB_URI}`);
    });

};
