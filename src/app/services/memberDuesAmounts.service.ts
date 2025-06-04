import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MemberDuesAmounts } from "../models/memberDuesAmounts";
import { Observable } from "rxjs";
import { CreateMemberDuesAmountsRequest } from "../models/requests/createMemberDuesAmountsRequest";
import { UpdateMemberDuesAmountsRequest } from "../models/requests/updateMemberDuesAmountsRequest";
import { environment } from "src/environments/environment";
import { TenantService } from "./tenant.service";
import { AccountsService } from "./accounts.service";

@Injectable({
  providedIn: 'root',
})
export class MemberDuesAmountsService {
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient, 
    private tenantService: TenantService, 
    private accountsService: AccountsService) {}

  public getMemberDuesAmounts(
    fromYear?: number, 
    toYear?: number): Observable<MemberDuesAmounts[]> {
      const tenantId = this.tenantService.getTenantId();
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

    let questionMarkAdded = false;
    let query = '';

    if (fromYear) {
      query = questionMarkAdded ? `${query}&fromYear=${fromYear}` : `${query}?fromYear=${fromYear}`;
      questionMarkAdded = true;
    }

    if (toYear) {
      query = questionMarkAdded ? `${query}&toYear=${toYear}` : `${query}?toYear=${toYear}`;
      questionMarkAdded = true;
    }

    return this.http.get<MemberDuesAmounts[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/memberDuesAmounts${query}`, 
      { headers: httpHeaders });
  }

  public createMemberDuesAmounts(request: CreateMemberDuesAmountsRequest): Observable<MemberDuesAmounts> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<MemberDuesAmounts>(
      `${this.baseUrl}/api/${tenantId}/v1.0/memberDuesAmounts/`, 
      request, 
      { headers: httpHeaders });
  }
  
  public updateMemberDuesAmounts(request: UpdateMemberDuesAmountsRequest): Observable<MemberDuesAmounts> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<MemberDuesAmounts>(
      `${this.baseUrl}/api/${tenantId}/v1.0/memberDuesAmounts/`, 
      request, 
      { headers: httpHeaders });
  }
}
