import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NavController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Device, Keyboard } from 'ionic-native';

import { Configuration } from '../../app/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  public hasPushPermission = false;
  public pushAvailable = false;
  public showChoices = false;
  public showNotifyOptions = false;
  public identity = '';
  public mozzarella = false;
  public pepperoni = false;
  public mushrooms = false;

  private identifier: string;

  constructor(
    public navCtrl: NavController, 
    public platform: Platform,
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
    private http: Http
  ) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.pushAvailable = this.platform.is('ios') || this.platform.is('android');
      if (Device.device && Device.device.uuid) {
        this.identifier = Device.device.uuid;
      }

      if (this.pushAvailable) {
        // ??? TODO
      }
    });
  }

  ngOnDestroy() {
  }

  changeIdentity(newValue: string) {
    this.identity = newValue;
    this.showChoices = this.identity.length !== 0;
  }

  changeChoices() {
    this.showNotifyOptions = this.mozzarella || this.pepperoni || this.mushrooms;
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
            Keyboard.close();
          }
        },
        {
          text: 'Setup',
          handler: data => {
            this.handlePhoneNumber(data);
            Keyboard.close();
          }
        }
      ]
    });

    prompt.present();
  }

  initializePush() {
  }

  private handlePhoneNumber({ phoneNumber }) {
    if (phoneNumber) {
      this.http.post(`${Configuration.registrationServer}/register/sms`, {
        number: phoneNumber,
        identity: this.identity,
        tags: this.getTags()
      }).toPromise().then(() => {
        let msg = `We will send you an SMS to "${phoneNumber}" as soon as a pizza is ready.`
        this.showMessage(msg);
      }).catch(err => {
        this.showMessage(err.message);
      });
    }
  }

  private registerHandlers(push) {
  }

  private showMessage(msg, showClose = false) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      showCloseButton: showClose,
      closeButtonText: 'OK'
    });

    toast.present();
  }

  private getTags() {
    let tags = ['mozzarella', 'pepperoni', 'mushrooms'];
    return tags.filter(tag => !!this[tag]);
  }

  private getPushServiceName() {
    if (this.platform.is('ios')) {
      return 'apn';
    }

    if (this.platform.is('android')) {
      return 'gcm';
    }

    return undefined;
  }
}
