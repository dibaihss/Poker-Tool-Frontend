import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-taskdescription',
  templateUrl: './taskdescription.page.html',
  styleUrls: ['./taskdescription.page.scss'],
})
export class TaskdescriptionPage implements OnInit {

  taskDescription: any
  singleTask: any
@Input('singleTask')img:any;
@Input('taskDescription')img1:any
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
close(){
  this.modalCtrl.dismiss()
}
}
