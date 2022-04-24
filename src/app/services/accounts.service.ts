import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LogInRequest } from '../models/requests/logInRequest';
import { LogInResponse } from '../models/responses/logInResponse';

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
      )
  }

  logout() {
    this.currentUserSource.next(null);
    this.loggedInUser = undefined;
  }

  setCurrentUser(user: LogInResponse) {
  }

  getKnightId() {
    return this.loggedInUser?.knight?.knightId;
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
      Array.isArray(tokenRoles) ? roles = tokenRoles : roles.push(tokenRoles);
    }

    return roles;
  }

  private getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}