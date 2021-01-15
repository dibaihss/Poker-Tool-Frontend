import { Component, Input, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { CommondataService } from "src/app/shared/commondata.service";

@Component({
  selector: "app-inviting",
  templateUrl: "./inviting.page.html",
  styleUrls: ["./inviting.page.scss"],
})
export class InvitingPage implements OnInit {
  idCurrentRoom;
  currentUserName;
  currentEmail;
  currentRoomName;
  typedEmail;
  friendsList: any[];
  returnedArrayOfMembers: any[];
  UsersInRoom: any[];
  bannedUsers = [{ UserName: "", UserEmail: "", friend: false, kicked: true }];
  bannedUsers1 = [{ UserName: "", UserEmail: "", friend: false, kicked: true }];
  myEmail;
  idCurrent;
  @Input("idCurrentRoom") img: any;
  @Input("currentUserName") user: any;
  @Input("UsersInRoom") UsersinRoom: any;
  @Input("friendsList") list: any;
  @Input("currentRoomName") RN: any;
  @Input("myEmail") myE: any;
  @Input("idCurrent") myId: any;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private CommonDS: CommondataService
  ) {
    this.bannedUsers.shift()
    // this.GetData();
  
  }

  ngOnInit() {}
  // async GetData() {
  //   console.log("Calling Data");
  //   const result = await this.callingData();
  //   console.log(result);
  //   console.log(this.currentRoomName);
  //   // this.CommonDS.firestore
  //   //   .collection("rooms")
  //   //   .doc(this.currentRoomName)
  //   //   .collection("RoomData")
  //   //   .doc("members")
  //   //   .onSnapshot((item) => {
  //   //     return (this.returnedArrayOfMembers = item.data().index);
  //   //   });
  //   // this.CommonDS.firestore
  //   //   .collection("rooms")
  //   //   .doc(this.currentRoomName)
  //   //   .collection("RoomData")
  //   //   .doc("bannedUsers")
  //   //   .onSnapshot((item) => {
  //   //     return (this.bannedUsers = item.data().index);
  //   //   });
  // }
  // callingData() {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve("resolved");
  //     }, 1000);
  //   });
  // }

  sendInvitaion(UserEmail) {
    var actionCodeSettings = {
      url: `https://poker-163f2.firebaseapp.com/home/test/register/room/2/${this.idCurrentRoom}/${this.currentRoomName}`,

      handleCodeInApp: true,
    };
    console.log("hallp");
    this.CommonDS.firebase
      .auth()
      .sendSignInLinkToEmail(UserEmail, actionCodeSettings)
      .then(() => {
        ("email sent");
        window.localStorage.setItem("emailForSignIn", UserEmail);
      });
  }

  sendFriendRequest(UserName) {

    
this.CommonDS.sendingAfriendshipRequest(UserName);

  }

  confirmBanUser(UserName, UserEmail, Isfriend) {
    this.alertCtrl
      .create({
        header: "Are you sure?",
        message: "you want to kick this user!",
        buttons: [
          {
            text: "cancel",
            role: "cancel",
          },
          {
            text: "confirm",
            handler: () => {
              this.BannUsers(UserName, UserEmail, Isfriend);
            },
          },
        ],
      })
      .then((alertEle) => {
        alertEle.present();
      });
  }

  BannUsers(UserName, UserEmail, Isfriend) {

    this.bannedUsers.push({
      UserName,
      UserEmail,
      friend: Isfriend,
      kicked: true,
    });
    this.CommonDS.updateBannedUsers(this.bannedUsers)
      
    // upadate the View

    this.UsersInRoom = this.UsersInRoom.filter((item) => {
      return item.Email !== UserEmail;
    });
    this.UsersInRoom.push({
      Name: UserName,
      Email: UserEmail,
      friend: Isfriend,
      kicked: true,
    });

  }

  CancelTheBanning(userName, userEmail, Isfriend) {
    this.bannedUsers = this.bannedUsers.filter((item) => {
      return item.UserEmail !== userEmail;
    });

    this.CommonDS.updateBannedUsers(this.bannedUsers)

   

    // upadate the View
    this.UsersInRoom = this.UsersInRoom.filter((item) => {
      return item.Email !== userEmail;
    });

    this.UsersInRoom.push({
      Name: userName,
      Email: userEmail,
      friend: Isfriend,
      kicked: false,
    });
  

    console.log(this.bannedUsers1);
  }
  close() {
    this.modalCtrl.dismiss();
  }
}
