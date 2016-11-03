'use strict';

const firebase = require('firebase');

function getUser(db) {
  const user = firebase.auth().currentUser;
  if (user) {
    return Promise.resolve(user);
  }

  return new Promise((resolve, reject) => {
    const off = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        off();
        resolve(user);
      } else {
        off();
        reject(new Error('USER NOT AUTHENTICATED'));
      }
    });
  });
}

function authenticate(db, email, pwd) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, pwd);
}

function push(db, path, data) {
  const dataToSend = data.timestamp
    ? Object.assign({}, data)
    : Object.assign({}, data, {
        timestamp: new Date().toISOString(),
      });

  return firebase
    .database()
    .ref()
    .child(path)
    .push(dataToSend);
}

function set(db, path, data) {
  const dataToSend = data.timestamp
    ? Object.assign({}, data)
    : Object.assign({}, data, {
        timestamp: new Date().toISOString(),
      });

  return firebase
    .database()
    .ref()
    .child(path)
    .set(data);
}

function getRange(db, path, _from, _to) {
  const end = typeof _to === 'string' ? _to : new Date().toISOString();
  const ref = firebase
    .database()
    .ref()
    .child(path)
    .orderByChild('timestamp');

  return _from
    ? ref
      .startAt(_from)
      .endAt(end)
      .once('value')
    : ref
      .limitToLast(1)
      .once('value');

}

function getAtTimestamp(db, path, timestamp) {
  return firebase
    .database()
    .ref()
    .child(path)
    .orderByChild('timestamp')
    .equalTo(timestamp)
    .once('value');
}

function getAtPath(path) {
  return firebase
    .database()
    .ref()
    .child(path)
    .once('value');
}

module.exports = function createDb({ apiKey, authDomain, databaseURL, storageBucket }) {
  const db = firebase.initializeApp({
    apiKey,
    authDomain,
    databaseURL,
    storageBucket,
  });

  return {
    authenticate: authenticate.bind(null, db),
    getAtPath: getAtPath.bind(null, db),
    getAtTimestamp: getAtTimestamp.bind(null, db),
    getRange: getRange.bind(null, db),
    getUser: getUser.bind(null, db),
    push: push.bind(null, db),
    set: set.bind(null, db),
  };
}
