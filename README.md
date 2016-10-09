# Owl Pizza

![](https://rawgithub.com/dkundel/owl-pizza/master/ionic/src/assets/pizza-logo.svg)

## About

This is a project to show different functionality of [Twilio Notify](https://www.twilio.com/notify) and [Ionic 2](http://ionicframework.com/docs/v2/). It consists of a [Node.js](https://nodejs.org) server and an Ionic app. 

## Requirements

- [Node.js](https://nodejs.org/en/)
- A Twilio Account - [Sign up here](https://www.twilio.com/try-twilio)
- Access to the Notify Developer Preview - [Apply here](https://www.twilio.com/console/notify/early-access)
- [Ngrok](https://ngrok.com) for exposing your localhost to the public and Twilio 
- For the iOS Application you will need a Apple Developer Account and Xcode installed
- For Android you will need a Google Developer Account and the Android Studio tools

## General Setup

1. Install the Ionic (v2 or higher) command-line tool
```bash
npm install ionic cordova phonegap -g
```

2. Get the necessary push credentials for iOS and Android. [Guide for iOS](https://www.twilio.com/docs/api/notifications/guides/configuring-ios-push-notifications) | [Guide for Android](https://www.twilio.com/docs/api/notifications/guides/configuring-android-push-notifications)

3. Create a [Twilio Notify Service](https://www.twilio.com/console/notify/services)

## Server Setup

1. Go into [`server/`](/server) and install the Node.js dependencies
```bash
cd server && npm install
``` 

2. Copy the [`.env.example`](/server/.env.example) into `.env`
```bash
cp .env.example .env
```

3. Configure `.env` with the necessary values for your account

4. Start the server by running 
```bash
node .
```

5. Run in a separate window `ngrok` to expose the server to the public and note down the URL for later
```bash
ngrok http 3000
```

## App Setup

1. Navigate in a separate terminal window into the `ionic/` directory and install the dependencies
```bash
cd ionic && npm install
```

2. Copy the config from the app
```bash
cp src/app/config.example.ts src/app/config.ts
```

3. Configure the `config.ts` file by filling out the `registrationServer` and `senderID` values.

4. Build the app for the different platfroms by running
```bash
ionic build
```

5. To deploy to iOS or Android open the respective projects in the `platform/` folders.

6. For more Ionic commands check out the [documentation for the Ionic CLI](http://ionicframework.com/docs/v2/cli/)

## Questions

If you have any questions, feel free to shoot me an email to [dkundel@twilio.com](mailto:dkundel@twilio.com)

## License

MIT

## Collaborators

Dominik Kundel <dominik.kundel@gmail.com>