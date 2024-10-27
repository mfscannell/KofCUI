import { Observable, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryFormOption } from '../models/inputOptions/countryFormOption';
import { GenericFormOption } from '../models/inputOptions/genericFormOption';

@Injectable({
  providedIn: 'root'
})

export class FormsService {
  private countryFormOptions?: Observable<CountryFormOption[]>;
  private activityCategoryFormOptions?: Observable<GenericFormOption[]>;
  private knightDegreeFormOptions?: Observable<GenericFormOption[]>;
  private knightMemberTypeFormOptions?: Observable<GenericFormOption[]>;
  private knightMemberClassFormOptions?: Observable<GenericFormOption[]>;
  private memberDuesPaymentStatusFormOptions?: Observable<GenericFormOption[]>;
  private timeZoneFormOptions?: Observable<GenericFormOption[]>;

  constructor(private http: HttpClient) {

  }

  getCountryFormOptions(): Observable<CountryFormOption[]> {
    if (!this.countryFormOptions) {
      console.log("no country form options.");
      this.countryFormOptions = this.http.get<CountryFormOption[]>('forms/countryFormOptions').pipe(shareReplay());
    }

    return this.countryFormOptions;
  }

  getActivityCategoryFormOptions(): Observable<GenericFormOption[]> {
    if (!this.activityCategoryFormOptions) {
      console.log('no activity category form options');
      this.activityCategoryFormOptions = this.http.get<GenericFormOption[]>('forms/activityCategoryFormOptions').pipe(shareReplay());
    }

    return this.activityCategoryFormOptions;
  }

  getKnightDegreeFormOptions(): Observable<GenericFormOption[]> {
    if (!this.knightDegreeFormOptions) {
      this.knightDegreeFormOptions = this.http.get<GenericFormOption[]>('forms/knightDegreeFormOptions').pipe(shareReplay());
    }

    return this.knightDegreeFormOptions;
  }

  getKnightMemberTypeFormOptions(): Observable<GenericFormOption[]> {
    if (!this.knightMemberTypeFormOptions) {
      this.knightMemberTypeFormOptions = this.http.get<GenericFormOption[]>('forms/knightMemberTypeFormOptions').pipe(shareReplay());
    }

    return this.knightMemberTypeFormOptions;
  }

  getKnightMemberClassFormOptions(): Observable<GenericFormOption[]> {
    if (!this.knightMemberClassFormOptions) {
      this.knightMemberClassFormOptions = this.http.get<GenericFormOption[]>('forms/knightMemberClassFormOptions').pipe(shareReplay());
    }

    return this.knightMemberClassFormOptions;
  }

  getMemberDuesPaymentStatusFormOptions(): Observable<GenericFormOption[]> {
    if (!this.memberDuesPaymentStatusFormOptions) {
      this.memberDuesPaymentStatusFormOptions = this.http.get<GenericFormOption[]>('forms/memberDuesPaymentStatusFormOptions')
        .pipe(shareReplay());
    }

    return this.memberDuesPaymentStatusFormOptions;
  }

  getTimeZoneFormOptions(): Observable<GenericFormOption[]> {
    if (!this.timeZoneFormOptions) {
      this.timeZoneFormOptions = this.http.get<GenericFormOption[]>('forms/allTimeZoneFormOptions').pipe(shareReplay());
    }

    return this.timeZoneFormOptions;
  }
}