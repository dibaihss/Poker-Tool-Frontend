import { Component, Input, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { CommondataService } from "src/app/shared/commondata.service";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.page.html",
  styleUrls: ["./friends.page.scss"],
})
export class FriendsPage implements OnInit {
  CurrentRoomID;
  friendsList: any[];
  currentUserName;
  myEmail;
  currentRoomName;
  friendsListoffriend: any[];

  @Input("friendsList") friendslist: any;
  @Input("CurrentRoomID") RoomID: any;
  @Input("myEmail") OwnEmail: any;
  @Input("currentUserName") ownName: any;
  @Input("currentRoomName") RN: any;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private CommonDS: CommondataService
  ) {}

  ngOnInit() {}
  sendInvitaion(UserName, UserEmail) {
    var actionCodeSettings = {
      url: `https://poker-163f2.firebaseapp.com/home/${UserName}/register/room/2/${this.CurrentRoomID}/${this.currentRoomName}`,

      handleCodeInApp: true,
    };

    this.CommonDS.firebase
      .auth()
      .sendSignInLinkToEmail(UserEmail, actionCodeSettings)
      .then(() => {
        ("email sent");
        window.localStorage.setItem("emailForSignIn", UserEmail);
      });
  }
  cancelFriendship(UserName, UserEmail) {
   this.alertCtrl
      .create({
        header: "Are you sure?",
        message: "You want to cancel the friendship!",
        buttons: [
          {
            text: "cancel",
            role: "cancel",
          },
          {
            text: "confirm",
            handler: () => {
              this.CommonDS.cancelFriendship(UserName, UserEmail)
            
            },
          },
        ],
      })
      .then((alertEle) => {
        alertEle.present();
      });

    console.log(this.friendsList);
  }
  close() {
    this.modalCtrl.dismiss();
  }
}
