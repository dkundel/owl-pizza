'use strict';

require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const Twilio = require('twilio');

const PORT = process.env.PORT || 3000;

const app = express();

// The Twilio dependencies
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const notifyService = client.notify.v1.services(process.env.TWILIO_NOTIFICATION_SERVICE_SID);

// Creates a Twilio Notify binding. Essentially an endpoint that a message can be sent to
function registerBinding(endpoint, identity, bindingType, address, tags) {
  return notifyService.bindings.create({
    endpoint,
    identity,
    bindingType,
    address,
    tag: tags
  });
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// POST endpoint that the Ionic App uses to register a new Push endpoint (iOS or Android)
app.post('/register/push', (req, res, next) => {
  let identity = req.body.identity;
  let endpoint = `app:${req.body.uuid}:${identity}`;
  let tags = req.body.tags;
  let address = req.body.address;
  let type = req.body.type;
  registerBinding(endpoint, identity, type, address, tags)
    .then((resp) => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

// POST endpoint that the Ionic App uses to register a new SMS endpoint (called from iOS, Android or Web)
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

// POST endpoint that the Twilio Facebook integration is posting to, on every incoming Facebook message to a certain page.
// THIS REQUIRES AN ADDITIONAL FEATURE TO BE ENABLED
app.post('/messenger', (req, res, next) => {
  let message = req.body.Body.trim();
  let from = req.body.From;
  let to = req.body.To;
  let response = '';

  // check if any option was chosen in the message
  let selected = getSelectedOptions(message);
  if (selected.length === 0) {
    // if not reply with the standard message
    response = getOptionsMessage();
  } else {
    // if they chose something, register binding. use the ID as username for now.
    response = `Thanks. We will notify you as soon as possible!`;
    selected.push('secret');
    let address = from.replace('Messenger:', '');
    let endpoint = `fb:inbox:${address}`;
    registerBinding(endpoint, address, 'facebook-messenger', address, selected);
  }

  client.messages.create({
    from: to,
    to: from,
    body: response
  }).then(resp => {
    console.log('Responsed to Facebook Message');
  }).catch(err => {
    console.error('oops');
    console.error(err.message);
  });
  res.status(200).send();
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// HELPER FUNCTIONS FOR THE FACEBOOK MESSENGER INTEGRATION

const OPTIONS = ['mozzarella', 'pepperoni', 'mushrooms'];

function getSelectedOptions(message) {
  let selectedOptions = [];
  for (let i = 0; i < OPTIONS.length; i++) {
    if (message.indexOf((i+1).toString()) !== -1) {
      selectedOptions.push(OPTIONS[i]);
    }
  }
  return selectedOptions;
}

function getOptionsMessage() {
  let optionsString = OPTIONS.map((opt, idx) => {
    return `(${idx+1}) for ${opt}`;
  }).join(', ');

  return `Ahoy!
To subscribe for updates write the numbers for the different types of pizza you want to subscribe for:
${optionsString}

Example:
1,3`;
}