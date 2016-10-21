'use strict';

const cron = require('node-cron');
const uuid = require('node-uuid');
const debug = require('debug')('da:poller');
const createStorage = require('./createStorage');
const createRequest = require('./createRequest');

// generates a staggering cron time; executes once every 5 mins; shifted by 1
function * createScheduler() {
  const arr = Array(12).fill(1);
  const interval = 5;
  let shift = 0; 

  while (true) {
    const mins = arr.map((itm, pos) => ((itm + (interval * pos)) + shift) % 60);
    shift = shift + 1;
    yield mins.join();
  }
}

module.exports = function createPoller(destinyApiKey) {
  const jobs = {};
  const storage = createStorage();
  const requestFactory = createRequest(storage, destinyApiKey);
  const scheduler = createScheduler();

  return {
    getAllJobIds() {
      return Object.keys(jobs);
    },
    schedule(username, options, requestCallback) {
      const id = uuid.v1();
      const task = requestFactory(id, username, options, requestCallback);

      debug('creating job: %s : %s', username, id);
      jobs[id] = cron.schedule(`${scheduler.next().value} * * * *`, task);

      return function off() {
        debug('destroying job: %s', id);
        jobs[id].destroy();
        delete jobs[id];
        return true;
      }
    },
    remove(id) {
      const isRemoved = !!(jobs[id] && jobs[id].destroy());

      if (isRemoved) {
        debug('destroying job: %s', id);
        delete jobs[id];
      }

      return isRemoved;
    },
  };
}
