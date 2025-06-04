import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Activity } from 'src/app/models/activity';
import { SendEmailRequest } from '../models/requests/sendEmailRequest';
import { SendEmailResponse } from '../models/responses/sendEmailResponse';
import { CreateActivityRequest } from '../models/requests/createActivityRequest';
import { UpdateActivityRequest } from '../models/requests/updateActivityRequest';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private accountsService: AccountsService) {}

  getAllActivities(): Observable<Activity[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Activity[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activities`, 
      { headers: httpHeaders });
  }

  createActivity(activity: CreateActivityRequest): Observable<Activity> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Activity>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activities/`, 
      activity, 
      { headers: httpHeaders });
  }

  updateActivity(updatedActivity: UpdateActivityRequest): Observable<Activity> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Activity>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activities/`, 
      updatedActivity, 
      { headers: httpHeaders });
  }

  sendEmailAboutActivity(activity: SendEmailRequest): Observable<SendEmailResponse> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<SendEmailResponse>(
      `${this.baseUrl}/api/${tenantId}/v1.0/activities/sendEmailAbountActivity`, 
      activity, 
      { headers: httpHeaders });
  }
}
