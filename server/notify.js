'use strict';

require('dotenv').load();

const twilio = require('twilio');

// Authenticate with Twilio
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Create a reference to the user notification service
const service = client.notify.v1.services(process.env.TWILIO_NOTIFICATION_SERVICE_SID);

// Send a notification 
// service.notifications.create({
//   'tag':'pepperoni',
//   'body':'Delicious!'
// }).then(function(response) {
//   console.log(response);
// }).catch(function(error) {
//   console.log(error);
// });

service.bindings.list().then(function (response) {
  console.log(response);
});