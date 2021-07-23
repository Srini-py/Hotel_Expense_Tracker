import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  invalidCredentials: boolean = false;

  constructor(private aus: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if(form.value.email === 'Team11b@4b.mvgrce' && form.value.password === '11B@2k17') {
      this.invalidCredentials = false;
      this.aus.Login();
      this.loadingCtrl.create({keyboardClose: true, message: "Please wait for a moment!", spinner: "dots"})
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/home');
        }, 1500);
      })
    }
    else {
      this.invalidCredentials = true;
    }
  }

  onSubmit(form: NgForm) {
    if(!form.valid) return;
    const email = form.value.email
    const pwd = form.value.password
  }

}
