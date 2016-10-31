import createDb from 'destiny-analytics-db/browser';
import moment from 'moment';

const db = createDb({ 
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  databaseURL: process.env.REACT_APP_FIREBASE_DB,
  storageBucket: process.env.REACT_APP_FIREBASE_BUCKET,
});

function auth() {
  return db.authenticate(process.env.REACT_APP_FIREBASE_EMAIL, process.env.REACT_APP_FIREBASE_PWD);
}

export function getLastDayCharacterData(membershipId, characterId) {
  const start = moment().subtract(1, 'days').startOf('day').toISOString();
  const end = moment().subtract(1, 'days').endOf('day').toISOString();

  return auth()
    .then(() => db.getRange(`/snapshots/${membershipId}`, start, end))
    .then(fbSnapshot => fbSnapshot.val());
}