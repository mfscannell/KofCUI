import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Knight } from 'src/app/models/knight';
import { ActivityInterest } from 'src/app/models/activityInterest'
import { UpdateKnightActivityInterestsRequest } from '../models/requests/updateKnightActivityInterestsRequest';
import { UpdateKnightPasswordRequest } from '../models/requests/updateKnightPasswordRequest';
import { UpdateKnightPasswordResponse } from '../models/responses/updateKnightPasswordResponse';
import { UpdateKnightAndActivityInterestsRequest } from '../models/requests/updateKnightAndActivityInterestsRequest';
import { KnightUser } from '../models/knightUser';

@Injectable({
    providedIn: 'root'
})

export class KnightsService {
    constructor(private http: HttpClient) {

    }

    getKnight(knightId: number): Observable<Knight> {
        return this.http.get<Knight>(`knights/${knightId}`);
    }

    getAllKnights(): Observable<Knight[]> {
        return this.http.get<Knight[]>('knights');
    }

    getAllKnightsNames(): Observable<Knight[]> {
        return this.http.get<Knight[]>('knights/namesOnly');
    }

    createKnightAndActivityInterest(knight: Knight) : Observable<Knight> {
        return this.http.post<Knight>('knights/withAllActivities', knight);
    }

    createKnights(knights: Knight[]) : Observable<Knight[]> {
        return this.http.post<Knight[]>('knights/multiple', knights);
    }

    updateKnightPersonalInfo(knight: Knight) : Observable<Knight> {
        return this.http.put<Knight>(`knights/${knight?.knightId}/personalInfo`, knight);
    }

    updateKnightAndActivityInterests(knight: UpdateKnightAndActivityInterestsRequest) : Observable<Knight> {
        return this.http.put<Knight>(`knights/${knight?.knightId}/withAllActivities`, knight);
    }

    updateKnightPassword(request: UpdateKnightPasswordRequest): Observable<KnightUser> {
        return this.http.put<KnightUser>(`knights/${request?.knightId}/password`, request);
    }

    updateKnightActivityInterest(updateKnightActivityInterestsRequest: UpdateKnightActivityInterestsRequest) : Observable<ActivityInterest[]> {
        return this.http.put<ActivityInterest[]>(`knights/${updateKnightActivityInterestsRequest.knightId}/activities`, updateKnightActivityInterestsRequest);
    }
}