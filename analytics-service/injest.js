'use strict';

const debug = require('debug')('da:service');
const storage = require('level')('_polling-ref-db', { valueEncoding: 'json' });
const createDb = require('destiny-analytics-db');
const createPoller = require('destiny-analytics-poller');

// should all of this be passed from a higher order service?

function onSnapshot(db, psn) {
  return (err, snapshot) => {
    debug('got snapshot response for username: %s', psn);
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
  }
}

function getIdIfScheduled(username) {
  return new Promise((resolve, reject) => {
    storage.get(username, (err, value) => {
      if (err) {
        if (err.notFound) {
          return resolve(null);
        }
        return reject(err);
      }

      return resolve(value);
    });
  });
}

function findUsernameById(id) {
  return new Promise((resolve, reject) => {
    storage
      .createReadStream({ valueEncoding: 'json' })
      .on('data', function (data) {
        if (data.value.id === id) {
          resolve({ username: data.key, data: data.value });
          this.destroy();
        }
      })
      .on('error', function (err) {
        reject(err);
        this.destroy();
      })
      .on('end', () => {
        resolve(null);
      });
  });
}

function putScheduledId(username, id, isStarted) {
  isStarted = isStarted || false;
  return new Promise((resolve, reject) => {
    return storage.put(username, { id, isStarted }, (err) => {
        return err
          ? reject(err)
          : resolve(id);
    });
  });
}

module.exports = function createService(creds) {
  const db = createDb({
    apiKey: creds.apiKey,
    authDomain: creds.authDomain,
    databaseURL: creds.databaseURL,
    storageBucket: creds.storageBucket,
  });

  const poller = createPoller(creds.destinyApiKey);

  const ready = db
  .authenticate(creds.firebaseEmail, creds.firebasePwd)
  .then(user => {
    return new Promise(resolve => {
      debug('authed as user: %s', user.uid);
      resolve();
    });
  });

  return {
    ready() {
      return ready;
    },
    getAllSchedules() {
      debug('returning all schedules...');
      return new Promise((resolve, reject) => {
        const agg = [];
        storage
          .createReadStream({ valueEncoding: 'json'})
          .on('data', data => {
            const pollerId = poller.getIdForUsername(data.key);
            if (pollerId) {
              agg.push(
                poller
                  .getMembershipIdForUsername(data.key)
                  .then(membershipId => ({
                    username: data.key,
                    scheduleId: data.value.id,
                    isStarted: data.value.isStarted,
                    membershipId,
                  }))
              );
            }
          })
          .on('error', function (err) {
            reject(err);
            this.destroy();
          })
          .on('end', () => {
            Promise.all(agg).then(resolve);
          });
      });
    },
    schedule(username) {
      debug('attaching polling for user: %s', username);
      return getIdIfScheduled(username)
        .then(value => {
          debug('got result from storage: %o', value);
          if (value) {
            if (value.isStarted) return value.id;

            debug('username %s is scheduled, but not started. starting', username);
            if (poller.start(value.id)) {
              debug('started successfully');
              return value.id;
            }
            
            // unless there is a problem with da-poller, the most likely reason for this
            // to happen is because we have stored an invalid id that the poller doesn't know about...
            throw new Error(`Failed to start job ${value.id} for user ${username}. Are you sure there exists a job for this user?`);
          }

          debug('username %s has not been scheduled, creating job...', username);
          return poller.schedule(username, onSnapshot(db, username));
        })
        .then(id => {
          return putScheduledId(username, id, true)
            .then(savedId => {
              debug('saved scheduled job id: %s %s', username, savedId);
              return savedId;
            })
        })
    },
    stop(id) {
      debug('trying to stop job for id: %s', id);
      return findUsernameById(id)
        .then(value => {
          debug('got result from storage: %o', value);
          if (!value) {
            throw new Error(`No scheduled job for username: ${value.username}`);
          }

          if (value && !value.data.isStarted) {
            debug('job already stopped for username: %s', value.username);
            return { username: value.username, id: value.data.id };
          }

          if (poller.stop(value.data.id)) {
            return { username: value.username, id: value.data.id };
          }
          else {
            throw new Error(`Failed to stop job for username: ${value.username}. Are you sure there is a job scheduled for this user?`);
          }
        })
        .then(value => {
          return putScheduledId(value.username, value.id, false)
            .then(() => {
              debug('saved updated scheduled job: %s %s isStarted: %s', value.username, value.id, false);
              return value.id;
            });
        })
    },
  };
}