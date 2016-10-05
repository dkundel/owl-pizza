import { Component } from '@angular/core';

import { OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Push, PushNotification } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  public hasPushPermission = false;
  public pushAvailable = false;

  private push: PushNotification;

  constructor(
    public navCtrl: NavController, 
    public platform: Platform,
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController
  ) {
    
  }

  ngOnInit() {
    this.pushAvailable = this.platform.is('ios') || this.platform.is('android');
    Push.hasPermission().then(({isEnabled}) => {
      this.hasPushPermission = isEnabled;
      if (this.hasPushPermission) {
        this.initializePush();
      }
    });
  }

  ngOnDestroy() {
    if (this.push) {
      this.push.unregister(() => {
        console.log('Unregistered');
      }, () => {
        console.error('Oh no. Something failed.');
      });
    }
  }

  showPhoneSetup() {
    let prompt = this.alertCtrl.create({
      title: 'Phone Number Configuration',
      message: 'Please specify the phone number we should message.',
      inputs: [
        {
          type: 'tel',
          placeholder: '+49 1111 111111111',
          name: 'phoneNumber'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Canceled');
          }
        },
        {
          text: 'Setup',
          handler: data => {
            this.handlePhoneNumber(data);
          }
        }
      ]
    });

    prompt.present();
  }

  showFacebookSetup() {
    let prompt = this.alertCtrl.create({
      title: 'Facebook Messenger Configuration',
      message: 'Please specify your Facebook Messenger username.',
      inputs: [
        {
          placeholder: 'yourFacebookUsername',
          name: 'fbName'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Canceled');
          }
        },
        {
          text: 'Setup',
          handler: data => {
            this.handleFacebook(data);
          }
        }
      ]
    });

    prompt.present();
  }

  initializePush() {
    if (this.pushAvailable) {
      this.push = Push.init({

      });

      this.registerHandlers();
    }
  }

  private handleFacebook({ fbName }) {
    if (fbName) {
      console.log(fbName);
      let msg = `We will send you a message to "${fbName}" as soon as a pizza is available.`
      this.showMessage(msg);
    }
  }

  private handlePhoneNumber({ phoneNumber }) {
    if (phoneNumber) {
      console.log(phoneNumber);
      let msg = `We will send you an SMS to "${phoneNumber}" as soon as a pizza is ready.`
      this.showMessage(msg);
    }
  }

  private showMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  private registerHandlers() {
    this.push.on('registration', response => {

    });

    this.push.on('notification', response => {

    });
  }
}
