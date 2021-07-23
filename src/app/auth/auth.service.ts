import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = false;

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  constructor() { }

  Login() {
    this._isAuthenticated = true;
  }

  Logout() {
    this._isAuthenticated = false;
  }
}
