import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditLogPageRoutingModule } from './edit-log-routing.module';

import { EditLogPage } from './edit-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditLogPageRoutingModule
  ],
  declarations: [EditLogPage]
})
export class EditLogPageModule {}
