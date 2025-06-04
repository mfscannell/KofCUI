import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ActivityEvent } from 'src/app/models/activityEvent';
import { UpcomingEvent } from '../models/upcomingEvent';
import { VolunteerForActivityEventRequest } from '../models/requests/volunteerForActivityEventRequest';
import { EventVolunteer } from '../models/eventVolunteer';
import { CreateActivityEventRequest } from '../models/requests/createActivityEventRequest';
import { environment } from 'src/environments/environment';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityEventsService {
  private upcomingEvents?: Observable<UpcomingEvent[]>;
  private baseUrl = environment.baseUrl;
  
  constructor(
    private http: HttpClient, 
    private tenantService: TenantService, 
    private accountsService: AccountsService) {}

  getAllActivityEvents(beginDate: string, endDate: string): Observable<ActivityEvent[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ActivityEvent[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activityEvents/byDateRange?beginDate=${beginDate}&endDate=${endDate}`, 
      { headers: httpHeaders });
  }

  getAllActivityEventsForVolunteering(beginDate: string, endDate: string): Observable<ActivityEvent[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ActivityEvent[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activityEvents/forVolunteering/byDateRange?beginDate=${beginDate}&endDate=${endDate}`, 
      { headers: httpHeaders }
    );
  }

  getAllUpcomingEvents(beginDate: string, endDate: string): Observable<UpcomingEvent[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<UpcomingEvent[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activityEvents/upcomingEvents?beginDate=${beginDate}&endDate=${endDate}`, 
      { headers: httpHeaders });
  }

  updateActivityEvent(activityEvent: ActivityEvent): Observable<ActivityEvent> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<ActivityEvent>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activityEvents/${activityEvent.id}`, 
      activityEvent, 
      { headers: httpHeaders });
  }

  createActivityEvent(activityEvent: CreateActivityEventRequest): Observable<ActivityEvent> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ActivityEvent>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activityEvents/`, 
      activityEvent, 
      { headers: httpHeaders });
  }

  volunteerForActivityEvent(volunteerForActivityEventRequest: VolunteerForActivityEventRequest,
  ): Observable<EventVolunteer[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<EventVolunteer[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activityEvents/volunteerFor`, 
      volunteerForActivityEventRequest, 
      { headers: httpHeaders });
  }
}
