import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ActivityEvent } from 'src/app/models/activityEvent';
import { UpcomingEvent } from '../models/upcomingEvent';

@Injectable({
    providedIn: 'root'
})

export class ActivityEventsService {
    constructor(private http: HttpClient) {

    }

    getAllActivityEvents(beginDate: string, endDate: string): Observable<ActivityEvent[]> {
        return this.http.get<ActivityEvent[]>(`api/6673/activityEvents/byDateRange?beginDate=${beginDate}&endDate=${endDate}`);
    }

    getAllUpcomingEvents(beginDate: string, endDate: string): Observable<UpcomingEvent[]> {
        return this.http.get<UpcomingEvent[]>(`api/6673/activityEvents/upcomingEvents?beginDate=${beginDate}&endDate=${endDate}`);
    }

    updateActivityEvent(activityEvent: ActivityEvent): Observable<ActivityEvent> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.put<ActivityEvent>(`api/6673/activityEvents/${activityEvent.activityEventId}`, activityEvent);
    }

    createActivityEvent(activityEvent: ActivityEvent): Observable<ActivityEvent> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.post<ActivityEvent>('api/6673/activityEvents/', activityEvent);
    }
}