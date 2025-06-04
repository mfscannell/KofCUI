import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LogInRequest } from '../models/requests/logInRequest';
import { LogInResponse } from '../models/responses/logInResponse';
import { ChangePassWordRequest } from '../models/requests/changePasswordRequest';
import { ChangePasswordResponse } from '../models/responses/changePasswordResponse';
import { PasswordRequirements } from '../models/responses/passwordRequirements';
import { environment } from 'src/environments/environment';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private currentUserSource = new ReplaySubject<LogInResponse | null>(1);
  currentUser = this.currentUserSource.asObservable();

  private loggedInUser?: LogInResponse;
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private tenantService: TenantService) {}

  public login(loginRequest: LogInRequest) {
    const tenantId = this.tenantService.getTenantId();
    const token = this.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<LogInResponse>(
      `${this.baseUrl}/api/${tenantId}/v1.0/accounts/login`, 
      loginRequest,
      { headers: httpHeaders }).pipe(
      map((response: LogInResponse) => {
        this.loggedInUser = response;
        this.currentUserSource.next(response);
      }),
    );
  }

  public changePassword(changePasswordRequest: ChangePassWordRequest): Observable<ChangePasswordResponse> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<ChangePasswordResponse>(
      `${this.baseUrl}/api/${tenantId}/v1.0/accounts/changePassword`,
      changePasswordRequest,
      { headers: httpHeaders });
  }

  public getPasswordRequirements(): Observable<PasswordRequirements> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<PasswordRequirements>(
      `${this.baseUrl}/api/${tenantId}/v1.0/accounts/passwordRequirements`, 
      { headers: httpHeaders });
  }

  logout() {
    this.currentUserSource.next(null);
    this.loggedInUser = undefined;
  }

  isLoggedIn() {
    return this.loggedInUser !== null && this.loggedInUser !== undefined;
  }

  setCurrentUser(user: LogInResponse) {
    console.log(user);
  }

  getKnightId() {
    return this.loggedInUser?.knight?.id;
  }

  public getToken() {
    let token = '';

    if (this.loggedInUser) {
      token = this.loggedInUser.webToken;
    }

    return token;
  }

  getRoles() {
    let roles: string[] = [];

    if (this.loggedInUser) {
      const tokenRoles = this.getDecodedToken(this.loggedInUser.webToken).role;

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
