'use strict';

const levelup = require('level');
const debug = require('debug')('da:poller:storage');

function normalizeUsername(raw) {
  return raw
    .replace(' ', '-');
}

function createPut(db) {
  return (key, value) => {
    return new Promise((res, rej) => {
      db.put(key, value, err => {
        if (err) {
          debug('error putting [%s] : %o : %o', key, value, err);
          return rej(err)
        }

        debug('put %s : %o', key, value);
        res();
      });
    });
  }
}

function createGet(db) {
  return key => {
    return new Promise((res, rej) => {
      db.get(key, (err, value) => {
        if (err) {
          if (err.notFound) {
            debug('key not found: %s', key);
            res();
          } else {
            debug('error getting [%s]: %o', key, err);
            rej(err);
          }
        } else {
          debug('get %s : %o', key, value);
          res(value);
        }
      });
    });
  }
}

module.exports = function createStorage() {
  const db = levelup('./_player-ref-db', { valueEncoding: 'json' });
  const get = createGet(db);
  const put = createPut(db);

  return {
    normalizeUsername,

    cacheCharacterMeta(username, info) {
      const un = `${normalizeUsername(username)}-cache`;
      debug('putting character cache %s: %o', un, info);
      return put(un, info);
    },
    setMembershipId(username, id) {
      const un = `${normalizeUsername(username)}-memid`;
      debug('putting membershipId %s : %s', un, id);
      return put(un, id);
    },
    setCharacterIdsByUser(username, ids) {
      const un = `${normalizeUsername(username)}-cids`;
      debug('putting characterIDs %s : %o', un, ids);
      return put(un, ids);
    },
    setCharacterIdsByMembershipId(memId, ids) {
      debug('putting characterIDs %s : %o', memId, ids);
      return put(memId, ids);
    },

    getCharacterCache(username) {
      const un = `${normalizeUsername(username)}-cache`;
      debug('getting character cache %s', un);
      return get(un);
    },
    getMembershipId(username) {
      const un = `${normalizeUsername(username)}-memid`;
      debug('getting membershipId %s', un);
      return get(un);
    },
    getCharacterIdsByUser(username) {
      const un = `${normalizeUsername(username)}-cids`;
      debug('getting characterIds %s', un);
      return get(un);
    },
    getCharacterIdsByMembershipId(memId) {
      debug('getting characterIds %s', memId);
      return get(memId);
    },

    close() {
      return new Promise(res => {
        db.close(res);
      });
    },
  };
}