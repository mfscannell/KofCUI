import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LogInRequest } from '../models/requests/logInRequest';
import { LogInResponse } from '../models/responses/logInResponse';
import { ChangePassWordRequest } from '../models/requests/changePasswordRequest';
import { ChangePasswordResponse } from '../models/responses/changePasswordResponse';
import { PasswordRequirements } from '../models/responses/passwordRequirements';

@Injectable({
    providedIn: 'root'
})

export class AccountsService {
  private currentUserSource = new ReplaySubject<LogInResponse | null>(1);
  currentUser = this.currentUserSource.asObservable();

  private loggedInUser?: LogInResponse;

  constructor(private http: HttpClient) {

  }

  login(loginRequest: LogInRequest) {
      return this.http.post<LogInResponse>('accounts/login', loginRequest).pipe(
        map((response: LogInResponse) => {
          this.loggedInUser = response;
          this.currentUserSource.next(response);
        })
      );
  }

  changePassword(changePasswordRequest: ChangePassWordRequest) : Observable<ChangePasswordResponse> {
    return this.http.put<ChangePasswordResponse>('accounts/changePassword', changePasswordRequest);
  }

  getPasswordRequirements() : Observable<PasswordRequirements> {
    return this.http.get<PasswordRequirements>('accounts/passwordRequirements');
  }

  logout() {
    this.currentUserSource.next(null);
    this.loggedInUser = undefined;
  }

  isLoggedIn() {
    return this.loggedInUser !== null && this.loggedInUser !== undefined;
  }

  setCurrentUser(user: LogInResponse) {
  }

  getKnightId() {
    return this.loggedInUser?.knight?.id;
  }

  getToken() {
    let token = '';

    if (this.loggedInUser) {
      token = this.loggedInUser.webToken;
    }

    return token;
  }

  getRoles() {
    let roles:string[] = [];

    if (this.loggedInUser) {
      let tokenRoles = this.getDecodedToken(this.loggedInUser.webToken).role;

      if (Array.isArray(tokenRoles)) {
        roles = tokenRoles;
      } else if (tokenRoles) {
        roles.push(tokenRoles);
      }
    }

    return roles;
  }

  private getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}