import * as dbService from '../../services/dbService';
import _debug from 'debug';

const debug = _debug('da:analytics:action');

function loadCharacterData() {
  return {
    type: 'loadCharacterData'
  };
}

function receiveCharacterData(characterData) {
  return {
    type: 'receiveCharacterData',
    characterData,
  };
}

function errorLoadingCharacterData(err) {
  return {
    type: 'errorLoadingCharacterData',
    error: err.message,
  };
}

export function fetchRecentCharacterData(membershipId, characterId) {
  return dispatch => {
    dispatch(loadCharacterData())

    debug('loading snapshots: %s %s', membershipId, characterId);

    dbService
      .getLastDayCharacterData(membershipId, characterId)
      .then(snapshots => {
        return Object
          .keys(snapshots)
          .map(key => snapshots[key])
          .map(snapshot => ({
            ...snapshot,
            characterStats: snapshot.characterStats.filter(ch => ch.id === characterId)[0],
          }))
      })
      .then(snapshots => {
        debug('got snapshots: %o', snapshots);
        dispatch(receiveCharacterData(snapshots))
      })
      .catch(err => {
        debug(err);
        dispatch(errorLoadingCharacterData(err))
      });
  }
}