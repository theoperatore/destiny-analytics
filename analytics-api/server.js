'use strict';

require('localenv');

const express = require('express');
const debug = require('debug')('da:api');

const v1 = require('./v1');

const app = express();
const PORT = 9000;
const svcCredentials = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH,
  databaseURL: process.env.FIREBASE_DB,
  storageBucket: process.env.FIREBASE_BUCKET,
  firebaseEmail: process.env.FIREBASE_EMAIL,
  firebasePwd: process.env.FIREBASE_PWD,
  destinyApiKey: process.env.DESTINY_API_KEY,
}

// v1 polling api
app.use('/v1', v1(svcCredentials));

const server = app.listen(PORT, () => {
  debug('api listening on port: %s', PORT);
});

// const players = [
  // 'Abersoto',
  // 'Veeridmoth',
  // 'OhHeckYes',
  // 'TheHurtWaffle',
  // 'MelanomaAIDS',
  // 'MrClean157',
// ];

module.exports = server;