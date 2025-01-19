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

@Injectable({
  providedIn: 'root',
})
export class KnightsService {
  constructor(private http: HttpClient) {}

  getKnight(knightId: string): Observable<Knight> {
    return this.http.get<Knight>(`v1.0/knights/${knightId}`);
  }

  getAllKnights(): Observable<Knight[]> {
    return this.http.get<Knight[]>('v1.0/knights');
  }

  getAllKnightsNames(context?: {restrictToActiveOnly: boolean}): Observable<KnightName[]> {
    let queryString = 'v1.0/knights/namesOnly';
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
    return this.http.post<Knight>('v1.0/knights/withAllActivities', knight);
  }

  createKnights(knights: CreateKnightRequest[]): Observable<Knight[]> {
    return this.http.post<Knight[]>('v1.0/knights/multiple', knights);
  }

  updateKnightPersonalInfo(knight: UpdateKnightPersonalInfoRequest): Observable<Knight> {
    return this.http.put<Knight>(`v1.0/knights/personalInfo`, knight);
  }

  updateKnightMembershipInfo(
    updateKnightMembershipInfoRequest: UpdateKnightMembershipInfoRequest,
  ): Observable<KnightInfo> {
    return this.http.put<KnightInfo>(`v1.0/knights/knightMembershipInfo`, updateKnightMembershipInfoRequest);
  }
  updateKnightPassword(request: UpdateKnightPasswordRequest): Observable<KnightUser> {
    return this.http.put<KnightUser>(`v1.0/knights/${request?.knightId}/password`, request);
  }
}
