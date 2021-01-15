import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomPage } from './room.page';

const routes: Routes = [
  {
    path: '',
    component: RoomPage
  },
  {
    path: 'taskdescription',
    loadChildren: () => import('./taskdescription/taskdescription.module').then( m => m.TaskdescriptionPageModule)
  },
  {
    path: 'inviting',
    loadChildren: () => import('./inviting/inviting.module').then( m => m.InvitingPageModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomPageRoutingModule {}
