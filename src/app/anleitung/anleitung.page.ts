import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-anleitung',
  templateUrl: './anleitung.page.html',
  styleUrls: ['./anleitung.page.scss'],
})
export class AnleitungPage implements OnInit {
showUsersInRoom = true
showFriendsList = true
  constructor(private modalCtrl: ModalController, private router: Router) {
    
   }

  ngOnInit() {
  }
  showFriendsListF(){
    this.showFriendsList = !this.showFriendsList
  }
  showUsersInRoomF(){
this.showUsersInRoom = !this.showUsersInRoom
  }
  close(){
    this.modalCtrl.dismiss().then(()=>{
      console.log("closed")
    }).catch((error)=>{
this.router.navigate(["/login"])
      
    })
    console.log(this.modalCtrl.dismiss())
  }
}
