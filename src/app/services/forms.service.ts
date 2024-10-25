import { Observable, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryFormOption } from '../models/inputOptions/countryFormOption';
import { GenericFormOption } from '../models/inputOptions/genericFormOption';
import { KnightDegreeFormOption } from '../models/inputOptions/knightDegreeFormOption';
import { KnightMemberTypeFormOption } from '../models/inputOptions/knightMemberTypeFormOption';
import { KnightMemberClassFormOption } from '../models/inputOptions/knightMemberClassFormOption';
import { MemberDuesPaymentStatusFormOption } from '../models/inputOptions/memberDuesPaymentStatusFormOption';
import { ActivityCategoryFormOption } from '../models/inputOptions/activityCategoryFormOption';
import { TimeZoneFormOption } from '../models/inputOptions/timeZoneFormOption';

@Injectable({
  providedIn: 'root'
})

export class FormsService {
  private countryFormOptions?: Observable<CountryFormOption[]>;
  private activityCategoryFormOptions?: Observable<ActivityCategoryFormOption[]>;
  private knightDegreeFormOptions?: Observable<KnightDegreeFormOption[]>;
  private knightMemberTypeFormOptions?: Observable<KnightMemberTypeFormOption[]>;
  private knightMemberClassFormOptions?: Observable<KnightMemberClassFormOption[]>;
  private memberDuesPaymentStatusFormOptions?: Observable<MemberDuesPaymentStatusFormOption[]>;
  private timeZoneFormOptions?: Observable<TimeZoneFormOption[]>;

  constructor(private http: HttpClient) {

  }

  getCountryFormOptions(): Observable<CountryFormOption[]> {
    if (!this.countryFormOptions) {
      console.log("no country form options.");
      this.countryFormOptions = this.http.get<CountryFormOption[]>('forms/countryFormOptions').pipe(shareReplay());
    }

    return this.countryFormOptions;
  }

  getActivityCategoryFormOptions(): Observable<ActivityCategoryFormOption[]> {
    if (!this.activityCategoryFormOptions) {
      console.log('no activity category form options');
      this.activityCategoryFormOptions = this.http.get<ActivityCategoryFormOption[]>('forms/activityCategoryFormOptions').pipe(shareReplay());
    }

    return this.activityCategoryFormOptions;
  }

  getKnightDegreeFormOptions(): Observable<KnightDegreeFormOption[]> {
    if (!this.knightDegreeFormOptions) {
      this.knightDegreeFormOptions = this.http.get<KnightDegreeFormOption[]>('forms/knightDegreeFormOptions').pipe(shareReplay());
    }

    return this.knightDegreeFormOptions;
  }

  getKnightMemberTypeFormOptions(): Observable<KnightMemberTypeFormOption[]> {
    if (!this.knightMemberTypeFormOptions) {
      this.knightMemberTypeFormOptions = this.http.get<KnightMemberTypeFormOption[]>('forms/knightMemberTypeFormOptions').pipe(shareReplay());
    }

    return this.knightMemberTypeFormOptions;
  }

  getKnightMemberClassFormOptions(): Observable<KnightMemberClassFormOption[]> {
    if (!this.knightMemberClassFormOptions) {
      this.knightMemberClassFormOptions = this.http.get<KnightMemberClassFormOption[]>('forms/knightMemberClassFormOptions').pipe(shareReplay());
    }

    return this.knightMemberClassFormOptions;
  }

  getMemberDuesPaymentStatusFormOptions(): Observable<MemberDuesPaymentStatusFormOption[]> {
    if (!this.memberDuesPaymentStatusFormOptions) {
      this.memberDuesPaymentStatusFormOptions = this.http.get<MemberDuesPaymentStatusFormOption[]>('forms/memberDuesPaymentStatusFormOptions')
        .pipe(shareReplay());
    }

    return this.memberDuesPaymentStatusFormOptions;
  }

  getTimeZoneFormOptions(): Observable<TimeZoneFormOption[]> {
    if (!this.timeZoneFormOptions) {
      this.timeZoneFormOptions = this.http.get<TimeZoneFormOption[]>('forms/allTimeZoneFormOptions').pipe(shareReplay());
    }

    return this.timeZoneFormOptions;
  }
}