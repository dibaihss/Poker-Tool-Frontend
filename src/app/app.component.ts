import { Component } from '@angular/core';
import firebase from 'firebase';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    var firebaseConfig = {
      apiKey: "AIzaSyCaqgeBhG1u1dCRv44yBfqWSNARWtzK1q8",
      authDomain: "poker-163f2.firebaseapp.com",
      databaseURL: "https://poker-163f2.firebaseio.com",
      projectId: "poker-163f2",
      storageBucket: "poker-163f2.appspot.com",
      messagingSenderId: "136201392430",
      appId: "1:136201392430:web:9388627c553307c27ceabf",
      measurementId: "G-M5XWH6N8KZ"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
