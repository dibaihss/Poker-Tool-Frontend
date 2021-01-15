import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitingPage } from './inviting.page';

const routes: Routes = [
  {
    path: '',
    component: InvitingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitingPageRoutingModule {}
