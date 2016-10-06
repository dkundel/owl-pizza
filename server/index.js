'use strict';

require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const Twilio = require('twilio');

const PORT = process.env.PORT || 3000;

const app = express();
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const notifyService = client.notify.v1.services(process.env.TWILIO_NOTIFICATION_SERVICE_SID);

function registerBinding(endpoint, identity, bindingType, address, tags) {
  console.log(arguments);
  return notifyService.bindings.create({
    endpoint,
    identity,
    bindingType,
    address,
    tags
  });
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/register/push', (req, res, next) => {
  let identity = req.body.identity;
  let endpoint = `app:${req.body.uuid}:${identity}`;
  let tags = req.body.tags;
  let address = req.body.address;
  let type = req.body.type;
  registerBinding(endpoint, identity, type, address, tags)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

app.post('/register/fb', (req, res, next) => {
  let identity = req.body.identity;
  let endpoint = `fb:inbox:${identity}`;
  let tags = req.body.tags;
  let username = req.body.username;
  registerBinding(endpoint, identity, 'facebook-messenger', username, tags)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

app.post('/register/sms', (req, res, next) => {
  let identity = req.body.identity;
  let endpoint = `sms:inbox:${identity}`;
  let tags = req.body.tags;
  let number = req.body.number;
  registerBinding(endpoint, identity, 'sms', number, tags)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
