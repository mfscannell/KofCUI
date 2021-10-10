import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Activity } from 'src/app/models/activity';

@Injectable({
    providedIn: 'root'
})

export class ActivitiesService {
    constructor(private http: HttpClient) {

    }

    getAllActivities(): Observable<Activity[]> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.get<Activity[]>('activities');
    }

    createActivity(activity: Activity): Observable<Activity> {
        return this.http.post<Activity>('activities/', activity);
    }

    updateActivity(updatedActivity: Activity): Observable<Activity> {
        return this.http.put<Activity>(`activities/${updatedActivity.activityId}`, updatedActivity);
    }
}