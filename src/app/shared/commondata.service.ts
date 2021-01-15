import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import firebase from "firebase";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommondataService {

  
  firestore = firebase.firestore();
  firebase = firebase;
  
  BannedUsers = [{ UserName: "", UserEmail: "", friend: false, kicked: true }];
  tasksArray = [{ id: null, singletask: "", taskDescription: "" }];
  MembersThatSelected = [
    { memberName: "", selectedTask: "", points: null, idTask: null },
  ];
  filteredRooms = [{ id: "", Room: "" }];
  returnedArrayOfMembers: any[];
  difficulty = { difficultyLevel: 0, difficultyColor: "" };
  usersInRoom = [{ Name: "", Email: "", friend: false, kicked: false }];
  friendsList = [{ friendName: "", hisEmail: "" }];
  friendsListoffriend: any[];
  friendRequest;
  friendData;
  myEmail: string;

  myEmailChange: Subject<string> = new Subject<string>();
  ArrayChange: Subject<any[]> = new Subject<any[]>();
  filteredRoomsChange: Subject<any[]> = new Subject<any[]>();
  tasksArrayChange: Subject<any[]> = new Subject<any[]>();
  memberThatSelectedChange: Subject<any[]> = new Subject<any[]>();
  returnedArrayOfMembersChange: Subject<any[]> = new Subject<any[]>();
  difficultyColorChange: Subject<string> = new Subject<string>();
  difficultyLevelChange: Subject<number> = new Subject<number>();

  usersInRoomChange: Subject<any[]> = new Subject<any[]>();
  friendsListChange: Subject<any[]> = new Subject<any[]>();
  friendRequestchange: Subject<object> = new Subject<object>();

  currentRoomName: string;
  currentUserName: string;
  constructor(private router: Router) {
    this.friendsList.shift();
    this.usersInRoom.shift();
    this.BannedUsers.shift();
    this.MembersThatSelected.shift();
    this.tasksArray.shift();

    this.firestore.collection("rooms").onSnapshot((querySnapshot) => {
      this.filteredRooms = [{ id: "", Room: "" }];
      querySnapshot.forEach((item) => {
        this.filteredRooms.push({ Room: item.id, id: item.data().RoomId });
        this.getAllRooms();
      });
    });




  }
  GetUserRoom(nameUrl, roomname) {
    this.currentUserName = nameUrl;
    this.currentRoomName = roomname;
    console.log(this.currentUserName, this.currentRoomName);

    this.firestore
      .collection("rooms")
      .doc(roomname)
      .collection("RoomData")
      .doc("members")
      .onSnapshot((item) => {
        if (item.data()) {
          this.returnedArrayOfMembers = item.data().index;
        }
        setTimeout(() => {
          this.change();
        }, 100);
      });

    this.firestore
      .collection("rooms")
      .doc(roomname)
      .collection("RoomData")
      .doc("bannedUsers")
      .onSnapshot((item) => {
        if (item.data()) {
          this.BannedUsers = item.data().index;
        }
        setTimeout(() => {
          this.change().then(() => {
            this.thisUserIsBanned();
          });
        }, 100);
      });

    this.firestore
      .collection("rooms")
      .doc(roomname)
      .collection("RoomData")
      .doc("tasks")
      .onSnapshot((item) => {
        if (item.data()) {
          this.tasksArray = item.data().index;
        }
        setTimeout(() => {
          this.change();
        }, 100);
      });

    this.firestore
      .collection("rooms")
      .doc(roomname)
      .collection("RoomData")
      .doc("UserVotes")
      .onSnapshot((item) => {
        if (item.data()) {
          this.MembersThatSelected = item.data().index;
        }
        setTimeout(() => {
          this.change();
        }, 100);
      });

    this.firestore
      .collection("rooms")
      .doc(roomname)
      .collection("RoomData")
      .doc("difficulty")
      .onSnapshot((item) => {
        if (item.data()) {
          this.difficulty = item.data().index;
        }
        setTimeout(() => {
          this.change();
        }, 100);
      });

    this.firestore
      .collection("rooms")
      .doc(roomname)
      .collection("RoomData")
      .doc("UsersInRoom")
      .onSnapshot((item) => {
        if (item.data()) {
          this.usersInRoom = item.data().index;
        }
        setTimeout(() => {
          this.change().then(() => {
            this.userExistingBefore();
          });
        }, 100);
      });

    // customData
    this.firestore
      .collection("customData")
      .doc(this.currentUserName)
      .onSnapshot((item) => {
        if (item.data().email) {
          this.myEmail = item.data().email;
        }
        setTimeout(() => {
          this.change();
        }, 100);
      });

    this.firestore
      .doc("customData/" + this.currentUserName)
      .collection("Friends")
      .doc("friendsList")
      .onSnapshot((item) => {
        if (item.data().index) {
          this.friendsList = item.data().index;
        }

        setTimeout(() => {
          this.change();
        }, 100);
      });

    this.firestore
      .doc("customData/" + this.currentUserName)
      .collection("Notfication")
      .doc("friendsrequests")
      .onSnapshot((item) => {
        if (item.data().index) {
          console.log(item.data().index[0]);
          this.friendData = {
            friendName: item.data().index[0].UserName,
            friendEmail: item.data().index[0].Email,
          };
          this.friendRequest = this.friendData.friendName;
          // get his friend List to add myself to it in case I accept
          this.firestore
            .doc("customData/" + item.data().index[0].UserName)
            .collection("Friends")
            .doc("friendsList")
            .onSnapshot((item) => {
              return (this.friendsListoffriend = item.data().index);
            });

          setTimeout(() => {
            this.gotAfriendRequest();
          }, 100);
        } else {
        }
      });

    // refesh the friends List
    this.firestore
      .doc("customData/" + this.currentUserName)
      .collection("Friends")
      .doc("friendsList")
      .onSnapshot((item) => {
        return (this.friendsList = item.data().index);
      });
  }

  RoomHasbeenDeleted() {
    this.firestore
      .collection("rooms")
      .doc(this.currentRoomName)
      .onSnapshot((item) => {
        if (item.data()) {
        } else {
          this.router.navigate(["/home", this.currentUserName, "register"]);
          alert("The Room has been deleted by the Admin");
        }
      });
  }

  async change() {
    this.ArrayChange.next(this.BannedUsers);
    this.tasksArrayChange.next(this.tasksArray);
    this.memberThatSelectedChange.next(this.MembersThatSelected);
    this.returnedArrayOfMembersChange.next(this.returnedArrayOfMembers);
    this.difficultyColorChange.next(this.difficulty.difficultyColor);
    this.difficultyLevelChange.next(this.difficulty.difficultyLevel);

    this.usersInRoomChange.next(this.usersInRoom);

    this.myEmailChange.next(this.myEmail);
    this.friendsListChange.next(this.friendsList);
  }
  async getAllRooms() {
    setTimeout(() => {
      this.filteredRoomsChange.next(this.filteredRooms);
    }, 100);
  }

  CreateRoom(RoomName, idAdminRoom, allMembers) {
    const docRefRoomNameID = this.firestore.doc("rooms/" + RoomName);
    docRefRoomNameID
      .set({
        RoomName: RoomName,
        RoomId: idAdminRoom,
      })
      .then((item) => {
        console.log("room created");
      })
      .catch((item) => {
        console.log("Room not created");
      });

    const docRef = this.firestore
      .doc("rooms/" + RoomName)
      .collection("RoomData")
      .doc("members");

    docRef
      .set({
        index: allMembers,
      })
      .then(function () {
        console.log("Member added");
      })
      .catch(function (error) {
        console.log("Got an error", error);
      });
  }

  thisUserIsBanned() {
    console.log(this.BannedUsers);
    let bannedUserFound = this.BannedUsers.find((user) => {
      return user.UserEmail === this.myEmail;
    });

    if (bannedUserFound) {
      alert("you are kicked from the Room");
      this.router.navigate(["/home", this.currentUserName, "register"]);
    }
  }

  userExistingBefore() {
    var UserExistingBefore = this.usersInRoom.find((item) => {
      return item.Email === this.myEmail;
    });

    if (UserExistingBefore) {
    } else {
      this.usersInRoom.push({
        Name: this.currentUserName,
        Email: this.myEmail,
        friend: false,
        kicked: false,
      });
      var refusersInRoom = this.firestore
        .doc("rooms/" + this.currentRoomName)
        .collection("RoomData")
        .doc("UsersInRoom");
      refusersInRoom
        .set({
          index: this.usersInRoom,
        })
        .then(() => {
          console.log("uploaded UsersInRoom");
        });
    }
  }

  sendingAfriendshipRequest(userName) {
    var ownCollec = this.firestore
      .doc("customData/" + userName)
      .collection("Notfication")
      .doc("friendsrequests");
    var friendsrequests = [
      { UserName: this.currentUserName, Email: this.myEmail },
    ];

    ownCollec.set({
      index: friendsrequests,
    });
  }

  gotAfriendRequest() {
    this.friendRequestchange.next(this.friendRequest);
  }

  friendshipAccepted() {
    this.friendsList.push({
      friendName: this.friendData.friendName,
      hisEmail: this.friendData.friendEmail,
    });
    var addNewFriend = this.firestore
      .doc("customData/" + this.currentUserName)
      .collection("Friends")
      .doc("friendsList");

    addNewFriend.set({
      index: this.friendsList,
    });
    // add myself to his friends List

    console.log(this.friendsListoffriend);
    this.friendsListoffriend.push({
      friendName: this.currentUserName,
      hisEmail: this.myEmail,
    });
    var addmyselfFriend = this.firestore
      .doc("customData/" + this.friendRequest.friendName)
      .collection("Friends")
      .doc("friendsList");

    addmyselfFriend.set({
      index: this.friendsListoffriend,
    });
    // init notfication
    var EmptyTheNotficationDoc = this.firestore
      .doc("customData/" + this.currentUserName)
      .collection("Notfication")
      .doc("friendsrequests");

    EmptyTheNotficationDoc.set({
      Email: "",
      UserName: "",
    })
      .then(() => {
        console.log("uploaded");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  cancelFriendship(UserName, UserEmail) {
    this.firestore
      .doc("customData/" + UserName)
      .collection("Friends")
      .doc("friendsList")
      .onSnapshot((item) => {
        return (this.friendsListoffriend = item.data().index);
      });

    this.friendsList = this.friendsList.filter((item) => {
      return item.hisEmail !== UserEmail;
    });

    this.firestore
      .doc("customData/" + this.currentUserName)
      .collection("Friends")
      .doc("friendsList")
      .set({
        index: this.friendsList,
      });

    setTimeout(() => {
      this.friendsListoffriend = this.friendsListoffriend.filter((item) => {
        return item.hisEmail !== this.myEmail;
      });

      console.log(this.friendsListoffriend);

      this.firestore
        .doc("customData/" + UserName)
        .collection("Friends")
        .doc("friendsList")
        .set({
          index: this.friendsListoffriend,
        });
    }, 100);
  }

  updateTasksArray(tasksArray) {
    const docRef = this.firestore
      .doc("rooms/" + this.currentRoomName)
      .collection("RoomData")
      .doc("tasks");

    docRef
      .set({
        index: tasksArray,
      })
      .then(function () {
        ("Status saved");
      })
      .catch(function (error) {});
  }

  updateMembersThatSelected(memberThatSelected) {
    const docRef = this.firestore
      .doc("rooms/" + this.currentRoomName)
      .collection("RoomData")
      .doc("UserVotes");
    docRef
      .set({
        index: memberThatSelected,
      })
      .then(function () {})
      .catch(function (error) {});
  }

  updateBannedUsers(bannedUsers) {
    var doRefBAnned = this.firestore
      .doc("rooms/" + this.currentRoomName)
      .collection("RoomData")
      .doc("bannedUsers");

    doRefBAnned.set({
      index: bannedUsers,
    });
  }

  updateDifficulty(difficulty) {
    const docRef = this.firestore
      .doc("rooms/" + this.currentRoomName)
      .collection("RoomData")
      .doc("difficulty");

    docRef.set({
      index: difficulty,
    });
  }

  updateMembers(returnedArrayOfMembers) {
    var docRefMembersOFRoom = this.firestore
      .doc("rooms/" + this.currentRoomName)
      .collection("RoomData")
      .doc("members");
    docRefMembersOFRoom
      .set({
        index: returnedArrayOfMembers,
      })
      .then(function () {
        console.log("Status saved");
      })
      .catch(function (error) {
        console.log("Got an error", error);
      });
  }
}
