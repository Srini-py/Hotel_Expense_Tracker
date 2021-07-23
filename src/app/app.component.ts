import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private as: AuthService, private router: Router) {}

  onLogout() {
    this.as.Logout();
    this.router.navigateByUrl('/auth');
  }
}
