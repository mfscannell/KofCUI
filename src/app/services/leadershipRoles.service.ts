import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LeadershipRole } from 'src/app/models/leadershipRole';
import { UpdateLeadershipRoleRequest } from '../models/requests/updateLeadershipRoleRequest';
import { environment } from 'src/environments/environment';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root',
})
export class LeadershipRolesService {
  private baseUrl = environment.baseUrl;
  
  constructor(
    private http: HttpClient, 
    private tenantService: TenantService, 
    private accountsService: AccountsService) {}

  public getAllLeadershipRoles(): Observable<LeadershipRole[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<LeadershipRole[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/leadershipRoles`, 
      { headers: httpHeaders });
  }

  updateLeadershipRole(request: UpdateLeadershipRoleRequest): Observable<LeadershipRole> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<LeadershipRole>(
      `${this.baseUrl}/api/${tenantId}/v1.0/leadershipRoles`, 
      request, 
      { headers: httpHeaders });
  }
}
