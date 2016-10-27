'use strict';

require('localenv');

const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const debug = require('debug')('mock');

const app = express();

const MOCK_SCHEDULES = require('./mockScheduleResponse.json');

const classMap = {
  '671679327': 'Hunter',
  '2271682572': 'Warlock',
  '3655393761': 'Titan'
};

function requestDestinyResource(url) {
  return fetch(url, {
    headers: {
      'X-Api-Key': process.env.DESTINY_API_KEY,
    }
  })
  .then(response => response.json())
  .then(res => res.Response.data);
}

app.use(cors());
app.use(bodyParser.json());

app.get('/v1/schedule', (req, res) => {
  debug('request for all schedules');
  res
    .status(200)
    .json(Object.assign({}, MOCK_SCHEDULES, {
      timestamp: new Date().toISOString(),
    }));
});

app.listen(9000, () => {
  debug('mock services running on port 9000');
})
