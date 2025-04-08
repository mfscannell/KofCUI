import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

@Injectable({
  providedIn: 'root',
})
export class KnightsService {
  constructor(private http: HttpClient) {}

  getKnight(knightId: string): Observable<Knight> {
    return this.http.get<Knight>(`knights/${knightId}`);
  }

  getAllKnights(filterRequest: FilterKnightRequest): Observable<PaginationResponse<Knight[]>> {
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

    return this.http.get<PaginationResponse<Knight[]>>(`${subdirectory}${query}`);
  }

  getAllKnightsNames(context?: {restrictToActiveOnly: boolean}): Observable<KnightName[]> {
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

    return this.http.get<KnightName[]>(queryString);
  }

  createKnightAndActivityInterest(knight: CreateKnightRequest): Observable<Knight> {
    return this.http.post<Knight>('knights/withAllActivities', knight);
  }

  createKnights(knights: CreateKnightRequest[]): Observable<Knight[]> {
    return this.http.post<Knight[]>('knights/multiple', knights);
  }

  updateKnightPersonalInfo(knight: UpdateKnightPersonalInfoRequest): Observable<Knight> {
    return this.http.put<Knight>(`knights/personalInfo`, knight);
  }

  updateKnightMembershipInfo(
    updateKnightMembershipInfoRequest: UpdateKnightMembershipInfoRequest,
  ): Observable<KnightInfo> {
    return this.http.put<KnightInfo>(`knights/knightMembershipInfo`, updateKnightMembershipInfoRequest);
  }
  updateKnightPassword(request: UpdateKnightPasswordRequest): Observable<KnightUser> {
    return this.http.put<KnightUser>(`knights/${request?.knightId}/password`, request);
  }
}
