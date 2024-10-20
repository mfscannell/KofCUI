import { Observable } from 'rxjs';
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
  constructor(private http: HttpClient) {

  }

  getCountryFormOptions(): Observable<CountryFormOption[]> {
    return this.http.get<CountryFormOption[]>('forms/countryFormOptions');
  }

  getActivityCategoryFormOptions(): Observable<ActivityCategoryFormOption[]> {
    return this.http.get<ActivityCategoryFormOption[]>('forms/activityCategoryFormOptions');
  }

  getKnightDegreeFormOptions(): Observable<KnightDegreeFormOption[]> {
    return this.http.get<KnightDegreeFormOption[]>('forms/knightDegreeFormOptions');
  }

  getKnightMemberTypeFormOptions(): Observable<KnightMemberTypeFormOption[]> {
    return this.http.get<KnightMemberTypeFormOption[]>('forms/knightMemberTypeFormOptions');
  }

  getKnightMemberClassFormOptions(): Observable<KnightMemberClassFormOption[]> {
    return this.http.get<KnightMemberClassFormOption[]>('forms/knightMemberClassFormOptions');
  }

  getMemberDuesPaymentStatusFormOptions(): Observable<MemberDuesPaymentStatusFormOption[]> {
    return this.http.get<MemberDuesPaymentStatusFormOption[]>('forms/memberDuesPaymentStatusFormOptions');
  }

  getTimeZoneFormOptions(): Observable<TimeZoneFormOption[]> {
    return this.http.get<TimeZoneFormOption[]>('forms/allTimeZoneFormOptions');
  }
}