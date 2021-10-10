import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Knight } from 'src/app/models/knight';

@Injectable({
    providedIn: 'root'
})

export class KnightsService {
    constructor(private http: HttpClient) {

    }

    getAllKnights(): Observable<Knight[]> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.get<Knight[]>('knights');
    }

    createKnightAndActivityInterest(knight: Knight) : Observable<Knight> {
        return this.http.post<Knight>('knights/withAllActivities', knight);
    }

    createKnights(knights: Knight[]) : Observable<Knight[]> {
        return this.http.post<Knight[]>('knights/multiple', knights);
    }

    updateKnightAndActivityInterest(knight: Knight) : Observable<Knight> {
        return this.http.put<Knight>(`knights/${knight?.knightId}/withAllActivities`, knight);
    }
}