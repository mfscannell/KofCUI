import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MemberDues } from '../models/memberDues';
import { UpdateKnightMemberDuesRequest } from '../models/requests/updateKnightMemberDuesRequest';
import { environment } from 'src/environments/environment';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root',
})
export class MemberDuesService {
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient, 
    private tenantService: TenantService, 
    private accountsService: AccountsService) {}

  public updateKnightMemberDues(knightMemberDues: UpdateKnightMemberDuesRequest): Observable<MemberDues[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.put<MemberDues[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/memberDues/forKnight`, 
      knightMemberDues, 
      { headers: httpHeaders });
  }
}
