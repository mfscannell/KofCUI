import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Knight } from 'src/app/models/knight';
import { ActivityInterest } from 'src/app/models/activityInterest'

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

    createKnightAndActivityInterest(knight: Knight) : Observable<Knight> {
        return this.http.post<Knight>('knights/withAllActivities', knight);
    }

    createKnights(knights: Knight[]) : Observable<Knight[]> {
        return this.http.post<Knight[]>('knights/multiple', knights);
    }

    updateKnight(knight: Knight) : Observable<Knight> {
        return this.http.put<Knight>(`knights/${knight?.knightId}`, knight);
    }

    updateKnightAndActivityInterest(knight: Knight) : Observable<Knight> {
        return this.http.put<Knight>(`knights/${knight?.knightId}/withAllActivities`, knight);
    }

    updateKnightActivityInterest(knightId: number, activityInterests: ActivityInterest[]) : Observable<ActivityInterest[]> {
        return this.http.put<ActivityInterest[]>(`knights/${knightId}/activities`, activityInterests);
    }
}