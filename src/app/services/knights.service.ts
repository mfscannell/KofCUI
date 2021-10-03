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
        return this.http.get<Knight[]>('api/6673/knights');
    }

    createKnightAndActivityInterest(knight: Knight) : Observable<Knight> {
        return this.http.post<Knight>('api/6673/knights/withAllActivities', knight);
    }

    createKnights(knights: Knight[]) : Observable<Knight[]> {
        return this.http.post<Knight[]>('api/6673/knights/multiple', knights);
    }

    updateKnightAndActivityInterest(knight: Knight) : Observable<Knight> {
        return this.http.put<Knight>(`api/6673/knights/${knight?.knightId}/withAllActivities`, knight);
    }
}