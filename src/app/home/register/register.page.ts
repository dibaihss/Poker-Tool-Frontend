import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AlertController, ModalController } from "@ionic/angular";
import { Store } from "@ngrx/store";

import firebase from "firebase";

import "firebase/storage";
import { Observable } from "rxjs";
import { Appstate, CreateJoin, JoinCreate } from "src/app/app.state";
import { CommondataService } from "src/app/shared/commondata.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  idAdminRoom;
  idMemberRoom;
  toggleView: Observable<JoinCreate>;
  toggleViewJoin: Observable<CreateJoin>;
  allMembers = [{ id: 0, MemberName: "", Email: "" }];
  returnedArrayOfMembers: any[];
  roomIdConfirmation: boolean;
  currentUserName;
  toggleOptions = true;
  filteredRooms = [{ id: "", Room: "" }];
  RoomName;
  myEmail;
  _subscription;
  ConfirmNewRoom;
  allTheRooms = [{ id: "", Room: "" }];
  firestore = firebase.firestore();

  constructor(
    private router: Router,
    private store: Store<Appstate>,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private CommonDS: CommondataService
  ) {
    this.filteredRooms.shift();
    this.route.paramMap.subscribe((params: ParamMap) => {
      let nameUrl = params.get("MemberName");
      

      this._subscription = CommonDS.myEmailChange.subscribe((value) => {
        this.myEmail = value;
      });

      this._subscription = CommonDS.returnedArrayOfMembersChange.subscribe(
        (value) => {
          this.returnedArrayOfMembers = value;
        }
      );

      this.currentUserName = nameUrl;
    });

    this.toggleView = this.store.select("JoinCreate");

    this.toggleViewJoin = this.store.select("CreateJoin");

    this.roomIdConfirmation = false;

    // get all rooms
   this.CommonDS.getAllRooms().then(() =>{
    this._subscription = CommonDS.filteredRoomsChange.subscribe((value) => {
      this.filteredRooms = value;
    });
   })

  }

  ngOnInit() {}

  CreateRoom() {
    
    this.ConfirmNewRoom = this.allTheRooms.find((item) => {
      return (
        item.id === this.idAdminRoom ||
        item.Room === this.RoomName ||
        (item.id === this.idAdminRoom && item.Room === this.RoomName)
      );
    });
    if (this.ConfirmNewRoom) {
      this.ConfirmNewRoom = "Pleas enter another Room Name or Room ID!";

    } else {
      this.CommonDS.GetUserRoom(this.currentUserName, this.RoomName)
      this.router.navigate([
        "/home",
        this.currentUserName,
        "register",
        "room",
        1,
        this.idAdminRoom,
        this.RoomName,
      ]);
 this.allMembers = [
        { id: 1, MemberName: this.currentUserName, Email: this.myEmail },
      ];
 this.CommonDS.CreateRoom(this.RoomName, this.idAdminRoom, this.allMembers);

    }
  }

  showProfiloptions() {
    this.toggleOptions = !this.toggleOptions;
  }

  async addMember() {

    var RoomFound = this.filteredRooms.find((Room) => {
      return Room.id === this.idMemberRoom;
    });

    if (RoomFound) {
      this.CommonDS.GetUserRoom(this.currentUserName, RoomFound.Room)
 
      var confirmAdmin = this.returnedArrayOfMembers.find(
        (member) => member.Email === this.myEmail
      );

      if (confirmAdmin && confirmAdmin.id === 1) {
        this.router.navigate([
          "/home",
          this.currentUserName,
          "register",
          "room",
          1,
          this.idMemberRoom,
          RoomFound.Room,
        ]);
      } else if (confirmAdmin) {
        this.router.navigate([
          "/home",
          this.currentUserName,
          "register",
          "room",
          2,
          this.idMemberRoom,
          RoomFound.Room,
        ]);
      } else {
        this.returnedArrayOfMembers.push({
          id: 2,
          MemberName: this.currentUserName,
          Email: this.myEmail,
        });
        this.router.navigate([
          "/home",
          this.currentUserName,
          "register",
          "room",
          2,
          this.idMemberRoom,
          RoomFound.Room,
        ]);
      }

      this.CommonDS.updateMembers(this.returnedArrayOfMembers);
     
    } else {
      this.roomIdConfirmation = true;
    }
    this.idMemberRoom = "";
  }
  callingData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolved");
      }, 500);
    });
  }
// Complette from here
  async EnteringRoom(RoomName, roomId) {
    console.log(RoomName);

    this.firestore
      .doc("rooms/" + RoomName)
      .collection("RoomData")
      .doc("members")
      .onSnapshot((item) => {
        return (this.returnedArrayOfMembers = item.data().index);
      });
    console.log("Calling Data");
    const result = await this.callingData();
    console.log(result);
    console.log(this.returnedArrayOfMembers);

    var MemberFound = this.returnedArrayOfMembers.find((item) => {
      return item.Email === this.myEmail;
    });

    console.log(MemberFound);
    if (MemberFound) {
      this.CommonDS.GetUserRoom(this.currentUserName, RoomName)

      this.router.navigate([
        "/home",
        this.currentUserName,
        "register",
        "room",
        MemberFound.id,
        roomId,
        RoomName,
      ]);
      console.log("success");
    } else {
      this.alertCtrl
        .create({
          message: "You are not a member in this Room!",
          buttons: [
            {
              text: "OK",
              role: "cancel",
            },
          ],
        })
        .then((alertEle) => {
          alertEle.present();
        });
    }
  }

  filter(data: string) {
    console.log(data);

    // this.allTheRooms = this.filteredRooms;
    if (data) {
      this.filteredRooms = this.filteredRooms.filter((cust) => {
        return cust.Room.toLowerCase().indexOf(data) > -1;
      });
    } else {
      this.filteredRooms = [];
      this.firestore
        .collection("rooms")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((item) => {
            this.filteredRooms.push({ Room: item.id, id: item.data().RoomId });
          });
        });
    }
  }

  async logout() {
    try {
      await firebase.auth().signOut();
      this.router.navigate(["/login"]);
    } catch (error) {
      console.log(error);
    }
  }


  back() {
    this.router.navigate(["/home", this.currentUserName]);
  }
}
