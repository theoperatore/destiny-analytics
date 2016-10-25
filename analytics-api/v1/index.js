'use strict';

const daService = require('destiny-analytics-service');
const Router = require('express').Router;
const bodyParser = require('body-parser');
const cors = require('cors');
const debug = require('debug')('da:routes');

class ValidationError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.type = 'ValidationError';
    this.status = 1;
  }
}

function validatePost(field, data) {
  return !data
    ? Promise.reject(new ValidationError(`Invalid data provided for scheduling: ${field} : ${data}`))
    : Promise.resolve();
}

function createErrorResponse(err) {
  return {
    errorCode: err.status || 10,
    message: err.message,
    timestamp: new Date().toISOString(),
  }
}

function createOkResponse(obj) {
  return {
    response: obj,
    errorCode: 0,
    message: null,
    timestamp: new Date().toISOString(),
  }
}

// THIS IS LITERALLY HERE SO I DON'T HAVE TO HAND CODE NETWORK REQUESTS EACH
// TIME I DEPLOY A NEW VERSION...
function bootstrap(svc) {
  debug('bootstrapping');
  svc
    .ready()
    .then(() => {
      return Promise.all([
        'Abersoto',
        'Veeridmoth',
        'OhHeckYes',
        'TheHurtWaffle',
        'MelanomaAIDS',
        'MrClean157',
      ]
      .map(psn => svc.schedule(psn)));
    })
    .then(() => {
      debug('bootstrapping done');
    })
}

module.exports = function createV1Api(creds) {
  const api = Router();
  const svc = daService(creds);

  bootstrap(svc);

  api.use(cors());
  api.use(bodyParser.json());
  api.post('/schedule', (req, res) => {
    return validatePost('username', req.body.username)
      .then(() => svc.ready())
      .then(() => svc.schedule(req.body.username))
      .then(id => {
        res
          .status(200)
          .json(createOkResponse({ scheduledId: id }));
      })
      .catch(err => {
        res
          .status(200)
          .json(createErrorResponse(err));
      });
  });

  api.post('/schedule/stop', (req, res) => {
    return validatePost('scheduledId', req.body.scheduledId)
      .then(() => svc.ready())
      .then(() => svc.stop(req.body.scheduledId))
      .then(id => {
        res
          .status(200)
          .json(createOkResponse({ scheduledId: id }));
      })
      .catch(err => {
        res
          .status(200)
          .json(createErrorResponse(err));
      });
  })

  api.get('/schedule', (req, res) => {
    return svc
      .ready()
      .then(() => svc.getAllSchedules())
      .then(schedules => {
        res
          .status(200)
          .json(createOkResponse({ schedules }));
      })
      .catch(err => {
        res
          .status(200)
          .json(createErrorResponse(err));
      });
  })

  return api;
}