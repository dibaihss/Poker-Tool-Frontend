import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitingPageRoutingModule } from './inviting-routing.module';

import { InvitingPage } from './inviting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvitingPageRoutingModule
  ],
  declarations: [InvitingPage]
})
export class InvitingPageModule {}
