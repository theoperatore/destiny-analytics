'use strict';

const test = require('tape');
const createStorage = require('../createStorage');

test('storage', t => {
  t.plan(4);

  const storage = createStorage();

  Promise
  .all([
    storage.setMembershipId('test1', 123456),
    storage.setCharacterIdsByUser('test1', [123, 456, 789]),
    storage.setCharacterIdsByMembershipId(123456, [123, 456, 789]),
    storage.setMembershipId('Abersoto is awesome', 90001),
  ])  
  .then(() => Promise.all([
    storage.getMembershipId('test1'),
    storage.getCharacterIdsByUser('test1'),
    storage.getCharacterIdsByMembershipId(123456),
    storage.getMembershipId('Abersoto is awesome'),
  ]))
  .then(results => {
    return storage
      .close()
      .then(() => results);
  })
  .then(results => {
    t.equal(results[0], 123456, 'got correct membership id');
    t.deepEqual(results[1], [123, 456, 789], 'got character ids from username');
    t.deepEqual(results[2], [123, 456, 789], 'got character ids from membership id');
    t.equal(results[3], 90001, 'correctly handles spaces in username');
  })
  .catch(err => {
    storage
      .close()
      .then(() => t.fail(err));
  })
});