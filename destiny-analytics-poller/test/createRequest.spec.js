'use strict';

const test = require('tape');
const createStorage = require('../createStorage');
const createRequest = require('../createRequest');

const API_KEY = "d45839607db54a84a5bd3df8e1307cf4";

test('request tasks', t => {
  t.plan(9);

  const storage = createStorage();
  const requestFactory = createRequest(storage, API_KEY);

  const task = requestFactory('1', 'Abersoto');

  task()
    .then(snapshot => {
      return storage
        .close()
        .then(() => snapshot);
    })
    .then(snapshot => {
      const ids = snapshot.characterStats.map(c => c.id);
      const pvp = snapshot.characterStats.map(c => c.pvp);
      const pvpModes = pvp.map(p => p.map(mode => mode.name));
      const inventories = snapshot.characterStats.map(c => c.items);

      const expectedModes = [
        [ 'allPvP',
          'supremacy',
          'trialsOfOsiris',
          'ironBanner',
          'team',
          'control',
          'lockdown',
        ],
        [ 'allPvP',
          'supremacy',
          'trialsOfOsiris',
          'ironBanner',
          'team',
          'control',
          'lockdown',
        ],
        [ 'allPvP',
          'supremacy',
          'trialsOfOsiris',
          'ironBanner',
          'team',
          'control',
          'lockdown',
        ]
      ];

      t.equals(snapshot.membershipId, '4611686018428573870', 'got correct membershipId');
      t.equals(snapshot.characterStats.length, 3, 'got all character data');
      t.deepEquals(ids, ['2305843009215440885', '2305843009319415812', '2305843009241700338'], 'character ids match');
      t.equals(pvp.length, 3, 'contains pvp data');
      t.deepEquals(pvpModes, expectedModes, 'got all pvp types of data');
      t.equals(inventories.length, 3, 'got all inventories');
      t.notEquals(inventories[0].length, 0, 'got inventory items character 1');
      t.notEquals(inventories[1].length, 0, 'got inventory items character 2');
      t.notEquals(inventories[2].length, 0, 'got inventory items character 3');
    })
    .catch(err => {
      return storage
        .close()
        .then(() => t.fail(err));
    });
});