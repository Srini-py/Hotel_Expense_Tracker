import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonItemSliding, ModalController } from '@ionic/angular';
import { AddLogComponent } from './add-log/add-log.component';
import { Log } from './log.model';
import { LogsService } from './logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})

export class LogsPage implements OnInit {
  recordList: Log[];
  recordList1: Log[];
  recordList2: Log[];
  allRecordList: Log[];
  record: Log;
  segmentValue: string;
  order: string = "all"
  orderType: string = "created"

  constructor(
    private ls: LogsService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionsheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.ls.logs.subscribe(logs => {
      this.allRecordList = logs;
      this.recordList = [...this.allRecordList];
      this.recordList1 = [...this.allRecordList];
      this.recordList2 = [...this.recordList1];
    });
  }

  ionViewWillEnter() {
    this.ls.fetchLogs().subscribe();
  }

  onFilterUpdate(event) {
    this.orderType = 'created'
    this.onFilterUpdate2(event.detail.value);
    this.onOrderUpdate2(this.orderType)
  }

  onFilterUpdate2(value) {
    this.recordList1 = [...this.allRecordList];
    if(value === 'all') {
      this.recordList1 = [...this.allRecordList];
    }
    else if(value === 'expenses') {
      this.recordList1 = this.allRecordList.filter(record => record.logType === 'Expense' );
    }
    else if(value === 'incomes') {
      this.recordList1 = this.allRecordList.filter(record => record.logType === 'Income' );
    }
    this.recordList = [...this.recordList1];
    this.order = value
  }

  onOrderUpdate(event) {
    this.onOrderUpdate2(event.detail.value);
  }

  onOrderUpdate2(value) {
    this.recordList2 = [...this.recordList1];
    if(value === 'created') {
      this.recordList2 = [...this.recordList1];
    }
    else if(value === 'oldest') {
      this.recordList2.sort((obj1, obj2) => {
        var c = new Date(obj1.date)
        var d = new Date(obj2.date)
        return (c > d)? 1: -1;
      })
    }
    else if(value === 'newest') {
      this.recordList2.sort((obj1, obj2) => {
        var c = new Date(obj1.date)
        var d = new Date(obj2.date)
        return (c > d)? 1: -1;
      })
      this.recordList2.reverse();
    }
    else if(value === 'alphabetic') {
      this.recordList2.sort((obj1, obj2) => (obj1.entry > obj2.entry)? 1: -1);
    }
    else if(value === 'dept') {
      this.recordList2.sort((obj1, obj2) => (obj1.department > obj2.department)? 1: -1);
    }
    else if(value === 'amount') {
      this.recordList2.sort((obj1, obj2) => (obj1.value > obj2.value)? 1: -1);
    }
    this.recordList = [...this.recordList2];
    this.orderType = value
  }

  onClickItem(recordId: string, slidingEl: IonItemSliding) {
    this.actionsheetCtrl.create({
      mode: 'ios',
      buttons: [
        {
          text: 'Edit this Log',
          handler: () => {
            this.onEdit(recordId, slidingEl);
          }
        },
        {
          text: 'Delete this Log',
          handler: () => {
            this.onDelete(recordId, slidingEl);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })
    .then((actionsheetEl) => {
      actionsheetEl.present();
    })
  }

  onCreateLog() {
    this.openLogModal();
  }

  openLogModal() {
    this.modalCtrl
      .create({
        component: AddLogComponent,
        componentProps: { listLength: this.allRecordList.length },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        if (res.role == 'confirm') {
          this.ls.addNewLog(
            res.data.logData.department,
            res.data.logData.logType,
            res.data.logData.entry,
            res.data.logData.value,
            res.data.logData.date
          ).subscribe();
          this.ls.logs.subscribe(logs => {
            this.allRecordList = logs;
            this.recordList = [...this.allRecordList];
            this.recordList1 = [...this.allRecordList];
            this.recordList2 = [...this.recordList1];
            this.onFilterUpdate2(this.order);
            this.onOrderUpdate2(this.orderType);
          });
        }
      });
  }

  onEdit(logId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.router.navigate(['/', 'logs', 'edit-log', logId]);
  }

  onDelete(logId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.alertCtrl
      .create({
        header: 'Confirm Delete',
        message: 'Do you want to confirm delete?',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.ls.deleteLog(logId).subscribe();
              this.ls.logs.subscribe(logs => {
                this.allRecordList = logs;
                this.recordList = [...this.allRecordList];
                this.recordList1 = [...this.allRecordList];
                this.recordList2 = [...this.recordList1];
                this.onFilterUpdate2(this.order);
                this.onOrderUpdate2(this.orderType);
              });
            },
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
