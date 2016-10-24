'use strict';

const base = 'https://www.bungie.net/platform/destiny';
const iconBase = 'https://www.bungie.net';
const player = `${base}/searchDestinyPlayer/%t/%s/`;
const summary = `${base}/%t/Account/%s/Summary/?definitions=true`;
const pvp = `${base}/Stats/%t/%s/%c/?modes=%m&groups=General`;
const inventory = `${base}/%t/Account/%s/Character/%c/Inventory/Summary/?definitions=true`;
const item = `${base}/%t/Account/%s/Character/%c/Inventory/%i/?definitions=true`;

module.exports = {
  search(type, username) {
    return player
      .replace('%t', type)
      .replace('%s', username);
  },
  userSummary(type, membershipId) {
    return summary
      .replace('%t', type)
      .replace('%s', membershipId);
  },
  pvp(type, membershipId, characterId, modes) {
    return pvp
      .replace('%t', type)
      .replace('%s', membershipId)
      .replace('%c', characterId)
      .replace('%m', modes);
  },
  inventory(type, membershipId, characterId) {
    return inventory
      .replace('%t', type)
      .replace('%s', membershipId)
      .replace('%c', characterId);
  },
  item(type, membershipId, characterId, itemId) {
    return item
      .replace('%t', type)
      .replace('%s', membershipId)
      .replace('%c', characterId)
      .replace('%i', itemId);
  },
  icon(url) {
    return `${iconBase}${url}`;
  }
}
