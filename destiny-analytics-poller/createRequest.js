'use strict';

const debug = require('debug')('da:poller:request');
const destinyGateway = require('./destinyGateway');

const DEFAULT_OPTIONS = {
  accountType: 2, // PSN is default
};

const PVP_MODES = [
  'AllPvP',
  'Supremacy',
  'TrialsOfOsiris',
  'IronBanner',
  'Team',
  'Control',
  'Lockdown',
];

// pause after an item request to not blast the bungie api; because I'm respectable!
function itemRequestFactory(apiKey, type, membershipId, characterId) {
  return itemId => () => {
    return new Promise((resolve, reject) => {
      destinyGateway
        .requestItem(apiKey, type, membershipId, characterId, itemId)
        .then(data => {
          setTimeout(() => {
            process.nextTick(() => {
              resolve(data);
            })
          }, 1000);
        })
        .catch(err => {
          setTimeout(() => {
            process.nextTick(() => {
              reject(err);
            })
          }, 1000);
        })
    });
  }
}

module.exports = function createRequest(storage, apiKey) {
  return (id, username, options, callback) => {

    const opts = typeof options === 'function' 
      ? Object.assign({}, DEFAULT_OPTIONS)
      : Object.assign({}, DEFAULT_OPTIONS, options);

    const cb = typeof options === 'function'
      ? options
      : callback;

    return () => {
      debug('running job: %s : %s', username, id);
      debug('getting membershipid for user: %s', username);

      return storage
        .getMembershipId(username)
        .then(membershipId => {
          debug('got membershipid from storage: %s %s', username, membershipId);

          return membershipId
            ? membershipId
            : destinyGateway.requestMembershipId(apiKey, opts.accountType, username)
                .then(requestedMemId => {
                  debug('storing membershipid: %s %s', username, requestedMemId);
                  return storage
                    .setMembershipId(username, requestedMemId)
                    .then(() => requestedMemId)
                });
        })
        .then(membershipId => {
          debug('requesting account summary...');
          return destinyGateway
            .requestAccountSummary(apiKey, opts.accountType, membershipId)
            .then(summary => {
              return {
                membershipId,
                characterStats: summary.data.characters.map(character => {
                  const base = character.characterBase;
                  const stats = base.stats;
                  const statsDefs = summary.definitions.stats;

                  return {
                    id: base.characterId,
                    stats: Object.keys(stats).map(stat => {
                      const hash = stats[stat].statHash;
                      return {
                        hash,
                        statIdentifier: stat,
                        displayName: statsDefs[hash].statName,
                        desc: statsDefs[hash].statDescription,
                        icon: statsDefs[hash].icon,
                        value: stats[stat].value,
                      }
                    }),
                  };
                }),
              };
            });
        })
        .then(snapshot => {
          debug('requesting pvp data for all characters...');
          return Promise.all(
            snapshot.characterStats.map(character => 
              destinyGateway.requestPvP(apiKey, opts.accountType, snapshot.membershipId, character.id, PVP_MODES.join())
            )
          )
          .then(pvps => {
            return Object.assign({}, snapshot, {
              characterStats: snapshot.characterStats.map((existingStats, idx) => {
                const pvpStats = pvps[idx];
                return Object.assign({}, existingStats, {
                  pvp: Object.keys(pvpStats).map(key => {
                    const st = pvpStats[key].allTime;
                    return {
                      name: key,
                      kd: (st && st.killsDeathsRatio.basic.value) || 0,
                      grenadeKills: (st && st.weaponKillsGrenade.basic.value) || 0,
                      meleeKills: (st && st.weaponKillsMelee.basic.value) || 0,
                      abilityKills: (st && st.abilityKills.basic.value) || 0,
                      superKills: (st && st.weaponKillsSuper.basic.value) || 0,
                    }
                  }),
                });
              }),
            });
          });
        })
        .then(snapshot => {
          debug('requesting inventory metadata for all characters...');
          return Promise.all(
            snapshot.characterStats.map(character => 
              destinyGateway.requestInventory(apiKey, opts.accountType, snapshot.membershipId, character.id)
            )
          )
          .then(inventoriesByCharacterIdx => {
            debug('requesting item data for all character inventories...');
            const itemsByCharacterIdx = inventoriesByCharacterIdx.map(inventory => inventory.data.items.map(itm => itm.itemId));
            const requestsByCharacterIdx = snapshot.characterStats.map((character, idx) => {
              const itemIds = itemsByCharacterIdx[idx];
              const request = itemRequestFactory(apiKey, opts.accountType, snapshot.membershipId, character.id);
              return itemIds.map(request);
            });

            // respectable english magic!
            return Promise.all(requestsByCharacterIdx.map(group => {
              return group.reduce((agg, request) => {
                return agg.then(out => {
                  return request().then(data => {
                    out.push(data);
                    return out;
                  })
                })
              }, Promise.resolve([]))
            }))
            .then(datasByCharacterIdx => {
              return Object.assign({}, snapshot, {
                characterStats: snapshot.characterStats.map((existingStats, idx) => {
                  const inventoryData = inventoriesByCharacterIdx[idx].data;
                  const inventoryDefs = inventoriesByCharacterIdx[idx].definitions;
                  const items = datasByCharacterIdx[idx];

                  return Object.assign({}, existingStats, {
                    items: items.map((itm, itmIdx) => ({
                      bucketName: inventoryDefs.buckets[inventoryData.items[itmIdx].bucketHash].bucketName,
                      itemName: inventoryDefs.items[inventoryData.items[itmIdx].itemHash].itemName,
                      itemDescription: inventoryDefs.items[inventoryData.items[itmIdx].itemHash].itemDescription || '', // emblems don't have descriptions; firebase doesn't like undefined
                      icon: inventoryDefs.items[inventoryData.items[itmIdx].itemHash].icon,
                      stats: itm.data.item.stats.map(stat => ({
                        statName: itm.definitions.stats[stat.statHash].statName,
                        statDescription: itm.definitions.stats[stat.statHash].statDescription,
                        icon: itm.definitions.stats[stat.statHash].icon,
                        value: stat.value,
                      })),
                    })),
                  });
                }),
              });
            });
          });
        })
        .then(snapshot => {
          if (cb) {
            cb(null, snapshot);
          }

          return snapshot;
        })
        .catch(err => {
          if (cb) {
            cb(err);
          }

          throw err;
        });
    }
  } 
}