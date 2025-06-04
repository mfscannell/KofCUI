import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ActivityInterest } from 'src/app/models/activityInterest';
import { UpdateKnightActivityInterestsRequest } from '../models/requests/updateKnightActivityInterestsRequest';
import { environment } from 'src/environments/environment';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root',
})
export class KnightActivityInterestsService {
  private baseUrl = environment.baseUrl;
  
  constructor(
    private http: HttpClient, 
    private tenantService: TenantService, 
    private accountsService: AccountsService) {}

  public getAllIKnightActivityInterestsForNewKnight(): Observable<ActivityInterest[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ActivityInterest[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knightActivityInterests`, 
      { headers: httpHeaders });
  }

  public updateKnightActivityInterests(
    updateKnightActivityInterestsRequest: UpdateKnightActivityInterestsRequest,
  ): Observable<ActivityInterest[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<ActivityInterest[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knightActivityInterests/forKnight`, 
      updateKnightActivityInterestsRequest, 
      { headers: httpHeaders });
  }
}
