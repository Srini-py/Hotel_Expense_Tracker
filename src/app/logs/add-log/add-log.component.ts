import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LogsService } from '../logs.service';

@Component({
  selector: 'app-add-log',
  templateUrl: './add-log.component.html',
  styleUrls: ['./add-log.component.scss'],
})
export class AddLogComponent implements OnInit {
  @ViewChild('f', { static: true }) form: NgForm;
  ev: Event;
  @Input() listLength: number;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onAddLog() {
    this.modalCtrl.dismiss(
      {
        logData: {
          department: this.form.value['dept'],
          logType: this.form.value['logType'],
          entry: this.form.value['logName'],
          value: this.form.value['logValue'],
          date: new Date(this.form.value['date']),
        },
      },
      'confirm'
    );
  }
}
