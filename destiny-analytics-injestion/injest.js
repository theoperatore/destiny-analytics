'use strict';

require('localenv');

const debug = require('debug')('da:service');
const createDb = require('destiny-analytics-db');
const createPoller = require('destiny-analytics-poller');

const db = createDb({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH,
  databaseURL: process.env.FIREBASE_DB,
  storageBucket: process.env.FIREBASE_BUCKET,
});

const poller = createPoller(process.env.DESTINY_API_KEY);

const players = [
  'Abersoto',
  'Veeridmoth',
  'OhHeckYes',
  'TheHurtWaffle',
  'MelanomaAIDS',
  'MrClean157',
];

function attachPolling(psns) {
  psns.forEach(psn => {
    poller.schedule(psn, (err, snapshot) => {
      debug('got snapshot response for psn: %s', psn);
      if (err) {
        debug('polling error: %o', err);
      } else {
        db
          .push(`/snapshots/${snapshot.membershipId}`, Object.assign({}, snapshot, {
            psn,
          }))
          .then(() => {
            debug('saved user to db: %s', psn);
          })
          .catch(err => {
            debug('db error: %o', err);
          })
      }
    });
  })
}

db
  .authenticate(process.env.FIREBASE_EMAIL, process.env.FIREBASE_PWD)
  .then(user => {
    debug('authed as user: %s', user.uid);
    debug('attaching polling for users: %o', players);

    attachPolling(players);
  });