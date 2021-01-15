import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import firebase from "firebase";
import { AlertController, ModalController } from "@ionic/angular";
import { ExportService } from "src/app/shared/export.service";
import { TaskdescriptionPage } from "./taskdescription/taskdescription.page";
import { InvitingPage } from "./inviting/inviting.page";
import { FriendsPage } from "./friends/friends.page";
import { CommondataService } from "src/app/shared/commondata.service";
import { AnleitungPage } from "src/app/anleitung/anleitung.page";

@Component({
  selector: "app-room",
  templateUrl: "./room.page.html",
  styleUrls: ["./room.page.scss"],
})
export class RoomPage implements OnInit {
  _subscription;
  returnedArrayOfMembers: any[];
  tasksArray = [{ id: null, singletask: "", taskDescription: "" }];
  singleTask: string;
  taskDescription = "";
  MembersThatSelected = [
    { memberName: "", selectedTask: "", points: null, idTask: null },
  ];
  currentSelectedTask: string;
  difficulty = { difficultyLevel: 0, difficultyColor: "" };
  markierteTask: number;
  idCurrent: number;
  currentUserName: string;
  idCurrentRoom: string;
  currentRoomName: string;
  myEmail: string;
  unterAnimation = false;
  estimatedTask = [{ Task: "" }];
  singleTaskforAnimi = "";
  ToggleDescription = false;
  clickedPoints = 0;
  givenPoints = null;
  taskHasVote = {
    memberName: "",
    selectedTask: "",
    points: null,
    idTask: null,
  };
  friendsList = [{ friendName: "", hisEmail: "" }];
  friendsListoffriend: any[];
  friendRequest;
  usersInRoom = [{ Name: "", Email: "", friend: false, kicked: false }];
  bannedUsers = [{ UserName: "", UserEmail: "", friend: false, kicked: false }];

  firestore = firebase.firestore();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private exportservice: ExportService,
    private modalCtrl: ModalController,
    private CommonDS: CommondataService
  ) {
    this.friendsList.shift();
    this.usersInRoom.shift();
    this.bannedUsers.shift();
    this.MembersThatSelected.shift();
    this.tasksArray.shift();

    this.route.paramMap.subscribe((params: ParamMap) => {
      let idUrl = parseInt(params.get("id"));
      let nameUrl = params.get("MemberName");
      let roomidUrl = params.get("roomid");
      let roomname = params.get("roomName");

      this.CommonDS.GetUserRoom(nameUrl, roomname);
      //room data
      

      this.CommonDS.RoomHasbeenDeleted();

      this._subscription = CommonDS.ArrayChange.subscribe((value) => {
        this.bannedUsers = value;
      });

      this._subscription = CommonDS.tasksArrayChange.subscribe((value) => {
        this.tasksArray = value;
      });

      this._subscription = CommonDS.memberThatSelectedChange.subscribe(
        (value) => {
          this.MembersThatSelected = value;
        }
      );

      this._subscription = CommonDS.returnedArrayOfMembersChange.subscribe(
        (value) => {
          this.returnedArrayOfMembers = value;
        }
      );

      this._subscription = CommonDS.difficultyColorChange.subscribe((value) => {
        console.log(value)
        this.difficulty.difficultyColor = value
      });
      this._subscription = CommonDS.difficultyLevelChange.subscribe((value) => {
        console.log(value)
        this.difficulty.difficultyLevel = value
      });

      this._subscription = CommonDS.usersInRoomChange.subscribe((value) => {
        this.usersInRoom = value;
      });

      // customData
      this._subscription = CommonDS.myEmailChange.subscribe((value) => {
        this.myEmail = value;
      });

      this._subscription = CommonDS.friendsListChange.subscribe((value) => {
        this.friendsList = value;
      });

      this._subscription = CommonDS.friendRequestchange.subscribe((value) => {
        if (value) {
          this.alertCtrl
            .create({
              header: "You got a friend request from " + value + "!",
              message: "",
              buttons: [
                {
                  text: "Reject",
                  role: "cancel",
                },
                {
                  text: "Accepct",
                  handler: () => {
                    this.CommonDS.friendshipAccepted();
                  },
                },
              ],
            })
            .then((alertEle) => {
              alertEle.present();
            });
        }
      });

      this.GetData();

      // get Notfication
      this.idCurrent = idUrl;
      this.currentUserName = nameUrl;
      this.idCurrentRoom = roomidUrl;
      this.currentRoomName = roomname;
    });
    // the complete process for users that signs with email link
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      console.log(email);
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      var cureUser = firebase.auth().currentUser;
      console.log(cureUser);
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)

        .then((result) => {
          console.log(result.user.email);
          console.log(result.user.displayName);
          if (
            result.user.displayName &&
            result.user.email &&
            result.user.emailVerified
          ) {
            this.router.navigate([
              "/home",
              result.user.displayName,
              "register",
              "room",
              2,
              this.idCurrentRoom,
              this.currentRoomName,
            ]);
          } else {
            firebase.auth().currentUser.delete();

            alert("sorry you have to create an account!");
            this.router.navigate(["/login"]);
          }

          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
        })
        .catch((error) => {
          console.log(error);
          this.router.navigate(["/login"]);
        });
    }
  }
  ngOnInit() {}

  exportToCsv(): void {
    this.exportservice.exportToCsv(this.MembersThatSelected, "user-data", [
      "memberName",
      "selectedTask",
      "points",
    ]);
  }
  async GetData() {
    console.log("Calling Data");
    const result = await this.callingData();
    console.log(result);
  }
  callingData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolved");
      }, 1000);
    });
  }

  refresh() {
    console.log();
  }

  addTasks() {
    var idTask = this.tasksArray.length;
    idTask++;
    this.tasksArray.push({
      id: idTask,
      singletask: this.singleTask,
      taskDescription: this.taskDescription,
    });

    this.CommonDS.updateTasksArray(this.tasksArray)
    
    this.singleTaskforAnimi = this.singleTask;
    this.singleTask = "";
    this.taskDescription = "";
    this.unterAnimation = true;
    setTimeout(() => {
      this.unterAnimation = false;
    }, 800);
  }

  async presentModal(singleTask, taskDescription) {
    singleTask;
    const modal = await this.modalCtrl.create({
      component: TaskdescriptionPage,
      cssClass: "my-custom-class",
      componentProps: { singleTask, taskDescription },
    });
    return await modal.present();
  }

  async presentModalInvitingList(
    idCurrentRoom,
    currentUserName,
    friendsList,
    currentRoomName,
    myEmail,
    idCurrent,
    UsersInRoom
  ) {
    console.log(UsersInRoom);
    for (let friend of this.friendsList) {
      var friendFound = UsersInRoom.find((item) => {
        return item.Email === friend.hisEmail;
      });
      console.log(friendFound);
      if (friendFound) {
        UsersInRoom = UsersInRoom.filter((item) => {
          return item !== friendFound;
        });
        UsersInRoom.push({
          Name: friendFound.Name,
          Email: friendFound.Email,
          friend: true,
          kicked: false,
        });
      }
    }
    console.log(UsersInRoom);
    for (let user of this.bannedUsers) {
      var bannedUserFound = UsersInRoom.find((item) => {
        return item.Email === user.UserEmail;
      });
      console.log("bannedUserFound");
      if (bannedUserFound) {
        UsersInRoom = UsersInRoom.filter((item) => {
          return item.Email !== bannedUserFound.Email;
        });
        UsersInRoom.push({
          Name: bannedUserFound.Name,
          Email: bannedUserFound.Email,
          friend: bannedUserFound.friend,
          kicked: true,
        });
      }
    }
    console.log(UsersInRoom);

    const modal = await this.modalCtrl.create({
      component: InvitingPage,
      cssClass: "InvitingList",
      componentProps: {
        idCurrentRoom,
        currentUserName,
        UsersInRoom,
        friendsList,
        currentRoomName,
        myEmail,
        idCurrent,
      },
    });
    return await modal.present();
  }

  async presentModalfriends(
    friendsList,
    idCurrentRoom,
    currentUserName,
    myEmail,
    currentRoomName
  ) {
    const modal = await this.modalCtrl.create({
      component: FriendsPage,
      cssClass: "frindsList",
      componentProps: {
        friendsList,
        idCurrentRoom,
        currentUserName,
        myEmail,
        currentRoomName,
      },
    });
    return await modal.present();
  }

  async presentModalAnleitung() {
  
    
  
   
    const modal = await this.modalCtrl.create({
     component: AnleitungPage,
      cssClass: 'anleitung',
     
    });
    return await modal.present();
  
  }

  onDeleteTask(idTask) {
    this.alertCtrl
      .create({
        header: "Are you sure",
        message: "Do you really want to delete the task!",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Delete",
            handler: () => {
              this.ClearTasks(idTask);
            },
          },
        ],
      })
      .then((alertEle) => {
        alertEle.present();
      });
  }

  ClearTasks(idTask) {
    this.tasksArray = this.tasksArray.filter((tasks) => {
      return tasks.id !== idTask;
    });

    this.CommonDS.updateTasksArray(this.tasksArray);
  }

  clickedTask(clickedTask: string, markierteTask: number) {
    this.currentSelectedTask = clickedTask;
    this.markierteTask = markierteTask;
    this.Calc();
    this.taskHasVote = this.MembersThatSelected.find((item) => {
      return (
        item.selectedTask === this.currentSelectedTask &&
        item.memberName === this.currentUserName
      );
    });
    if (this.taskHasVote) {
      this.givenPoints = this.taskHasVote.points;
    } else {
      this.clickedPoints = 0;
      this.givenPoints = 0;
    }
  }

  GetPoints(points: number) {
    if (this.currentSelectedTask) {
      this.taskHasVote = this.MembersThatSelected.find((item) => {
        return (
          item.selectedTask === this.currentSelectedTask &&
          item.memberName === this.currentUserName
        );
      });

      if (this.currentSelectedTask && !this.taskHasVote) {
        this.clickedPoints = points;
        this.estimatedTask.push({ Task: this.currentSelectedTask });

        this.MembersThatSelected.push({
          memberName: this.currentUserName,
          selectedTask: this.currentSelectedTask,
          points,
          idTask: this.markierteTask,
        });

        this.taskHasVote = this.MembersThatSelected.find((item) => {
          return (
            item.selectedTask === this.currentSelectedTask &&
            item.memberName === this.currentUserName
          );
        });
        this.givenPoints = this.taskHasVote.points;

        this.CommonDS.updateMembersThatSelected(this.MembersThatSelected);
      } else {
        this.alertCtrl
          .create({
            header: "Multiple Voting!",
            message:
              "You cant vote for the same task twice! if you confirm the previous vote will be deleted",
            buttons: [
              {
                text: "Cancel",
                role: "cancel",
              },
              {
                text: "Confirm",
                handler: () => {
                  this.ConfirmOverWrite(points);
                },
              },
            ],
          })
          .then((alertEle) => {
            alertEle.present();
          });
      }
    }
    this.Calc();
  }

  ConfirmOverWrite(points: number) {
    this.clickedPoints = points;
    this.taskHasVote = this.MembersThatSelected.find((item) => {
      return (
        item.selectedTask === this.currentSelectedTask &&
        item.memberName === this.currentUserName
      );
    });

    this.MembersThatSelected = this.MembersThatSelected.filter((item) => {
      return item !== this.taskHasVote;
    });

    this.givenPoints = 0;
    this.CommonDS.updateMembersThatSelected(this.MembersThatSelected);
  }

  Calc() {
    var summe = 0;
    var filteredTasks = this.MembersThatSelected.filter((item) => {
      return item.idTask === this.markierteTask;
    });
console.log(filteredTasks)
    for (let UserVote of filteredTasks) {
      summe += UserVote.points;
    }

    this.difficulty.difficultyLevel = summe / filteredTasks.length;

    this.difficulty.difficultyLevel = this.difficulty.difficultyLevel / 55;

    if (this.difficulty.difficultyLevel >= 0.7) {
      this.difficulty.difficultyColor = "danger";
    }
    if (
      this.difficulty.difficultyLevel < 0.7 &&
      this.difficulty.difficultyLevel >= 0.4
    ) {
      this.difficulty.difficultyColor = "warning";
    }
    if (this.difficulty.difficultyLevel < 0.4) {
      this.difficulty.difficultyColor = "success";
    }

    this.CommonDS.updateDifficulty(this.difficulty);
  }

  toggleDEscription() {
    this.ToggleDescription = !this.ToggleDescription;
  }

  deleteRoom() {
    this.alertCtrl
      .create({
        message: "Are you sure, you want to delete the Room!",
        buttons: [
          {
            text: "cancel",
            role: "cancel",
          },
          {
            text: "confirm",
            handler: () => {
              console.log("confirmDeleting");
              this.router.navigate(["/home", this.currentUserName, "register"]);
              this.firestore
                .collection("rooms")
                .doc(this.currentRoomName)
                .delete();
            },
          },
        ],
      })
      .then((alertEle) => {
        alertEle.present();
      });
  }
  back() {
    this.router.navigate(["/home", this.currentUserName, "register"]);
  }
}
