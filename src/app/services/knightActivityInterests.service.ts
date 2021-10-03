import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ActivityInterest } from 'src/app/models/activityInterest';

@Injectable({
    providedIn: 'root'
})

export class KnightActivityInterestsService {
    constructor(private http: HttpClient) {

    }

    getAllIKnightActivityInterestsForNewKnight(): Observable<ActivityInterest[]> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.get<ActivityInterest[]>('api/6673/knightActivityInterests');
    }
}