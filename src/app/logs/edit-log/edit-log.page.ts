import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Log } from '../log.model';
import { LogsService } from '../logs.service';

@Component({
  selector: 'app-edit-log',
  templateUrl: './edit-log.page.html',
  styleUrls: ['./edit-log.page.scss'],
})
export class EditLogPage implements OnInit {
  @ViewChild('f', { static: true }) form: NgForm;
  record: Log;
  dt: string;
  isLoading: boolean = false;

  constructor(
    private ls: LogsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private datepipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((map) => {
      if (!map.has('logId')) {
        this.navCtrl.navigateBack('/logs');
        return;
      }
      this.isLoading = true;
      this.ls.getLog(map.get('logId')).subscribe(log => {
        this.record = log;
        this.dt = this.datepipe.transform(this.record.date, 'MMM-dd-YYYY');
        this.isLoading = false;
      });
    });
  }

  ionViewWillEnter() {
    this.ls.fetchLogs().subscribe();
  }

  onEditLog() {
    this.ls
      .updateLog(
        this.record.id,
        this.form.value['dept'],
        this.form.value['lg'],
        this.form.value['expenseName'],
        this.form.value['expenseValue'],
        this.form.value['date']
      ).subscribe();
      this.router.navigateByUrl('/logs');
  }
}

// import { DatePipe } from '@angular/common';
// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { LoadingController, NavController } from '@ionic/angular';
// import { Subscription } from 'rxjs';
// import { Log } from '../log.model';
// import { LogsService } from '../logs.service';

// @Component({
//   selector: 'app-edit-log',
//   templateUrl: './edit-log.page.html',
//   styleUrls: ['./edit-log.page.scss'],
// })
// export class EditLogPage implements OnInit, OnDestroy {
//   @ViewChild('f', {static: true}) form: NgForm;
//   dt: string;
//   log: Log;
//   editForm: FormGroup;
//   logsSub: Subscription;
//   isLoading = false;

//   constructor(
//     private lgs: LogsService,
//     private route: ActivatedRoute,
//     private navCtrl: NavController,
//     private loadingCtrl: LoadingController,
//     private datepipe: DatePipe,
//     private router: Router
//   ) {}

//   ionViewWillEnter() {
//     console.log("Edit Log Page Ionview before subscription");
//     this.lgs.fetchLogs().subscribe();
//     console.log("Edit Log Page Ionview after subscription");
//   }

//   ngOnInit() {
//     console.log("Edit Log Page Init before subscription");
//     this.route.paramMap.subscribe((paramMap) => {
//       if (!paramMap.has('logId')) {
//         this.navCtrl.navigateBack('/logs');
//         return;
//       }
//       this.isLoading = true;
//       this.logsSub = this.lgs.getLog(paramMap.get('logId')).subscribe((log) => {
//         this.log = log;
//         this.isLoading = false;
//       })
//       // this.logsSub = this.lgs.getLog(paramMap.get('logId')).subscribe((log) => {
//       //   this.log = log;
//       //   this.dt = this.datepipe.transform(this.log.date, 'MMM-DD-YYYY');
//       //   // this.editForm = new FormGroup({
//       //   //   sampDate: new FormControl(dt, {
//       //   //     updateOn: 'blur',
//       //   //     validators: [Validators.required],
//       //   //   }),
//       //   //   sampDept: new FormControl(this.log.department, {
//       //   //     updateOn: 'blur',
//       //   //     validators: [Validators.required],
//       //   //   }),
//       //   //   sampLog: new FormControl(this.log.logType, {
//       //   //     updateOn: 'blur',
//       //   //     validators: [Validators.required],
//       //   //   }),
//       //   //   sampEntry: new FormControl(this.log.entry, {
//       //   //     updateOn: 'blur',
//       //   //     validators: [Validators.required],
//       //   //   }),
//       //   //   sampValue: new FormControl(this.log.value, {
//       //   //     updateOn: 'blur',
//       //   //     validators: [Validators.required],
//       //   //   })
//       //   // });
//       // });
//       console.log("Edit Log Page Init after subscription");
//     });
//   }

//   ngOnDestroy() {
//     if (this.logsSub) this.logsSub.unsubscribe();
//   }

//   OnEditLog() {
//     this.loadingCtrl.create({
//       message: 'Applying changes...',
//       spinner: 'lines-small'
//     })
//     .then((loadingEl) => {
//       loadingEl.present();
//       this.lgs
//       .updateLog(
//         this.log.id,
//         this.form.value['dept'],
//         this.form.value['lg'],
//         this.form.value['expenseName'],
//         this.form.value['expenseValue'],
//         this.form.value['date']
//       )
//       .subscribe(() => {
//         loadingEl.dismiss();
//         this.editForm.reset();
//         this.router.navigateByUrl('/logs');
//       });
//     })
//   }
// }
