import { Observable, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CountryFormOption } from '../models/inputOptions/countryFormOption';
import { GenericFormOption } from '../models/inputOptions/genericFormOption';
import { environment } from 'src/environments/environment';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  private countryFormOptions?: Observable<CountryFormOption[]>;
  private activityCategoryFormOptions?: Observable<GenericFormOption[]>;
  private knightDegreeFormOptions?: Observable<GenericFormOption[]>;
  private knightMemberTypeFormOptions?: Observable<GenericFormOption[]>;
  private knightMemberClassFormOptions?: Observable<GenericFormOption[]>;
  private memberDuesPaymentStatusFormOptions?: Observable<GenericFormOption[]>;
  private timeZoneFormOptions?: Observable<GenericFormOption[]>;
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient, 
    private accountsService: AccountsService) {}

  public getCountryFormOptions(): Observable<CountryFormOption[]> {
    if (!this.countryFormOptions) {
      console.log('no country form options.');
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.countryFormOptions = this.http.get<CountryFormOption[]>(
        `${this.baseUrl}/api/v1.0/forms/countryFormOptions`, 
        { headers: httpHeaders }).pipe(shareReplay());
    }

    return this.countryFormOptions;
  }

  public getActivityCategoryFormOptions(): Observable<GenericFormOption[]> {
    if (!this.activityCategoryFormOptions) {
      console.log('no activity category form options');
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.activityCategoryFormOptions = this.http
        .get<GenericFormOption[]>(
          `${this.baseUrl}/api/v1.0/forms/activityCategoryFormOptions`, 
          { headers: httpHeaders })
        .pipe(shareReplay());
    }

    return this.activityCategoryFormOptions;
  }

  public getKnightDegreeFormOptions(): Observable<GenericFormOption[]> {
    if (!this.knightDegreeFormOptions) {
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.knightDegreeFormOptions = this.http
        .get<GenericFormOption[]>(
          `${this.baseUrl}/api/v1.0/forms/knightDegreeFormOptions`, 
          { headers: httpHeaders })
        .pipe(shareReplay());
    }

    return this.knightDegreeFormOptions;
  }

  public getKnightMemberTypeFormOptions(): Observable<GenericFormOption[]> {
    if (!this.knightMemberTypeFormOptions) {
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.knightMemberTypeFormOptions = this.http
        .get<GenericFormOption[]>(
          `${this.baseUrl}/api/v1.0/forms/knightMemberTypeFormOptions`, 
          { headers: httpHeaders })
        .pipe(shareReplay());
    }

    return this.knightMemberTypeFormOptions;
  }

  public getKnightMemberClassFormOptions(): Observable<GenericFormOption[]> {
    if (!this.knightMemberClassFormOptions) {
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.knightMemberClassFormOptions = this.http
        .get<GenericFormOption[]>(
          `${this.baseUrl}/api/v1.0/forms/knightMemberClassFormOptions`, 
          { headers: httpHeaders })
        .pipe(shareReplay());
    }

    return this.knightMemberClassFormOptions;
  }

  public getMemberDuesPaymentStatusFormOptions(): Observable<GenericFormOption[]> {
    if (!this.memberDuesPaymentStatusFormOptions) {
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.memberDuesPaymentStatusFormOptions = this.http
        .get<GenericFormOption[]>(
          `${this.baseUrl}/api/v1.0/forms/memberDuesPaymentStatusFormOptions`, 
          { headers: httpHeaders })
        .pipe(shareReplay());
    }

    return this.memberDuesPaymentStatusFormOptions;
  }

  public getTimeZoneFormOptions(): Observable<GenericFormOption[]> {
    if (!this.timeZoneFormOptions) {
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.timeZoneFormOptions = this.http.get<GenericFormOption[]>(
        `${this.baseUrl}/api/v1.0/forms/allTimeZoneFormOptions`, 
        { headers: httpHeaders }).pipe(shareReplay());
    }

    return this.timeZoneFormOptions;
  }
}
