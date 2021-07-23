import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogsPage } from './logs.page';

const routes: Routes = [
  {
    path: '',
    component: LogsPage
  },
  {
    path: 'edit-log/:logId',
    loadChildren: () => import('./edit-log/edit-log.module').then( m => m.EditLogPageModule)
  },
  {
    path: 'edit-log',
    loadChildren: () => import('./edit-log/edit-log.module').then( m => m.EditLogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe]
})
export class LogsPageRoutingModule {}
