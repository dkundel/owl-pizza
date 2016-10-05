import { Component } from '@angular/core';

import { OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Push, PushNotification } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  public hasPushPermission = false;
  private push: PushNotification;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    
  }

  ngOnInit() {
    Push.hasPermission().then(({isEnabled}) => {
      this.hasPushPermission = isEnabled;
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
    if (!this.hasPushPermission) {
      this.push = Push.init({

      });

      this.registerHandlers();
    }
  }

  private handleFacebook(data) {
    if (data.fbName) {
      console.log(data.fbName);
    }
  }

  private handlePhoneNumber(data) {
    if (data.phoneNumber) {
      console.log(data.phoneNumber);
    }
  }

  private registerHandlers() {
    this.push.on('registration', response => {

    });

    this.push.on('notification', response => {

    });
  }
}
