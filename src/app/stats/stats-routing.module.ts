import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsPage } from './stats.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/stats/data',
    pathMatch: 'full'
  },
  {
    path: '',
    component: StatsPage,
    children: [
      {
        path: '',
        redirectTo: 'stats/data',
        pathMatch: 'full'
      },
      {
        path: 'data',
        loadChildren: () => import('./data/data.module').then( m => m.DataPageModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then( m => m.ChartsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsPageRoutingModule {}
