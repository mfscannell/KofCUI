import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Activity } from 'src/app/models/activity';
import { SendEmailRequest } from '../models/requests/sendEmailRequest';
import { SendEmailResponse } from '../models/responses/sendEmailResponse';

@Injectable({
    providedIn: 'root'
})

export class ActivitiesService {
    constructor(private http: HttpClient) {

    }

    getAllActivities(): Observable<Activity[]> {
        return this.http.get<Activity[]>('activities');
    }

    createActivity(activity: Activity): Observable<Activity> {
        return this.http.post<Activity>('activities/', activity);
    }

    updateActivity(updatedActivity: Activity): Observable<Activity> {
        return this.http.put<Activity>('activities/', updatedActivity);
    }

    sendEmailAboutActivity(activity: SendEmailRequest): Observable<SendEmailResponse> {
        return this.http.post<SendEmailResponse>('activities/sendEmailAbountActivity', activity);
    }
}