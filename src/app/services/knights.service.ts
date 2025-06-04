import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Knight } from 'src/app/models/knight';
import { UpdateKnightPasswordRequest } from '../models/requests/updateKnightPasswordRequest';
import { KnightUser } from '../models/knightUser';
import { UpdateKnightPersonalInfoRequest } from '../models/requests/updateKnightPersonalInfoRequest';
import { KnightInfo } from '../models/knightInfo';
import { UpdateKnightMembershipInfoRequest } from '../models/requests/updateKnightMembershipInfoRequest';
import { CreateKnightRequest } from '../models/requests/createKnightRequest';
import { KnightName } from '../models/knightName';
import { PaginationResponse } from '../models/responses/paginationResponse';
import { FilterKnightRequest } from '../models/requests/filterKnightRequest';
import { environment } from 'src/environments/environment';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root',
})
export class KnightsService {
  private baseUrl = environment.baseUrl;
  
  constructor(
    private http: HttpClient,
    private tenantService: TenantService, 
    private accountsService: AccountsService) {}

  public getKnight(knightId: string): Observable<Knight> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<Knight>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knights/${knightId}`, 
      { headers: httpHeaders });
  }

  public getAllKnights(filterRequest: FilterKnightRequest): Observable<PaginationResponse<Knight[]>> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    const subdirectory = 'knights';
    let query = '';

    if (filterRequest.skip) {
      query = query.length ? `${query}&skip=${filterRequest.skip}` : `?skip=${filterRequest.skip}`;
    }

    if (filterRequest.take) {
      query = query.length ? `${query}&take=${filterRequest.take}` : `?take=${filterRequest.take}`;
    }

    if (filterRequest.nameSearch) {
      query = query.length ? `${query}&nameSearch=${filterRequest.nameSearch}` : `?nameSearch=${filterRequest.nameSearch}`;
    }

    if (filterRequest.searchDegrees) {
      query = query.length ? `${query}&degreesSearch=${filterRequest.searchDegrees}` : `?degreesSearch=${filterRequest.searchDegrees}`;
    }

    console.log(`${subdirectory}${query}`);

    return this.http.get<PaginationResponse<Knight[]>>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knights${query}`, 
      { headers: httpHeaders });
  }

  public getAllKnightsNames(context?: {restrictToActiveOnly: boolean}): Observable<KnightName[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    let queryString = 'knights/namesOnly';
    let queryStringContainsParam = false;

    if (context?.restrictToActiveOnly) {
      if (queryStringContainsParam) {
        queryString = `${queryString}&restringToActiveOnly=true`;
      } else {
        queryString = `${queryString}?restringToActiveOnly=true`;
      }

      queryStringContainsParam = true;
    }

    return this.http.get<KnightName[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/${queryString}`, 
      { headers: httpHeaders });
  }

  public createKnightAndActivityInterest(knight: CreateKnightRequest): Observable<Knight> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Knight>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knights/withAllActivities`, 
      knight, 
      { headers: httpHeaders });
  }

  public createKnights(knights: CreateKnightRequest[]): Observable<Knight[]> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Knight[]>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knights/multiple`, 
      knights, 
      { headers: httpHeaders });
  }

  public updateKnightPersonalInfo(knight: UpdateKnightPersonalInfoRequest): Observable<Knight> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Knight>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knights/personalInfo`, 
      knight, 
      { headers: httpHeaders });
  }

  public updateKnightMembershipInfo(
    updateKnightMembershipInfoRequest: UpdateKnightMembershipInfoRequest,
  ): Observable<KnightInfo> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<KnightInfo>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knights/knightMembershipInfo`, 
      updateKnightMembershipInfoRequest, 
      { headers: httpHeaders });
  }

  public updateKnightPassword(request: UpdateKnightPasswordRequest): Observable<KnightUser> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<KnightUser>(
      `${this.baseUrl}/api/${tenantId}/v1.0/knights/${request?.knightId}/password`, 
      request, 
      { headers: httpHeaders });
  }
}
