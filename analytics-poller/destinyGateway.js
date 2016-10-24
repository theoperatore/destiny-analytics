'use strict';

const fetch = require('node-fetch');
const debug = require('debug')('da:poller:gateway');
const createDestinyUrls = require('./endpoints');

function request(apiKey, url) {
  return fetch(url, {
    headers: {
      'X-Api-Key': apiKey,
    },
  })
  .then(response => response.json())
  .then(res => {
    if (res.ErrorCode !== 1 || res.ErrorStatus !== 'Success') {
      throw new Error(`${res.ErrorStatus}: ${res.Message}`);
    }

    return res;
  });
}

exports.requestMembershipId = function requestMembershipId(apiKey, type, username) {
  const url = createDestinyUrls.search(type, username);

  debug('fetching membershipId for username: %s', url);
  return request(apiKey, url)
    .then(res => res.Response && res.Response.length > 0 && res.Response[0].membershipId);
}

exports.requestAccountSummary = function requestAccountSummary(apiKey, type, membershipId) {
  const url = createDestinyUrls.userSummary(type, membershipId);

  debug('fetching account summary for membershipId:%s', url);
  return request(apiKey, url)
    .then(res => res.Response);
}

exports.requestPvP = function requestPvP(apiKey, type, membershipId, characterId, modes) {
  const url = createDestinyUrls.pvp(type, membershipId, characterId, modes);

  debug('fetching pvp data: %s', url);
  return request(apiKey, url)
    .then(res => res.Response);
}

exports.requestInventory = function requestInventory(apiKey, type, membershipId, characterId) {
  const url = createDestinyUrls.inventory(type, membershipId, characterId);

  debug('fetching inventory data: %s', url);
  return request(apiKey, url)
    .then(res => res.Response);
}

exports.requestItem = function requestItem(apiKey, type, membershipId, characterId, itemId) {
  const url = createDestinyUrls.item(type, membershipId, characterId, itemId);

  debug('fetching item data: %s', url);
  return request(apiKey, url)
    .then(res => res.Response);
}
