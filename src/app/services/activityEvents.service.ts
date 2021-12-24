import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ActivityEvent } from 'src/app/models/activityEvent';
import { UpcomingEvent } from '../models/upcomingEvent';
import { VolunteerForActivityEventRequest } from '../models/requests/volunteerForActivityEventRequest';
import { EventVolunteer } from '../models/eventVolunteer';

@Injectable({
    providedIn: 'root'
})

export class ActivityEventsService {
    constructor(private http: HttpClient) {

    }

    getAllActivityEvents(beginDate: string, endDate: string): Observable<ActivityEvent[]> {
        return this.http.get<ActivityEvent[]>(`activityEvents/byDateRange?beginDate=${beginDate}&endDate=${endDate}`);
    }

    getAllUpcomingEvents(beginDate: string, endDate: string): Observable<UpcomingEvent[]> {
        return this.http.get<UpcomingEvent[]>(`activityEvents/upcomingEvents?beginDate=${beginDate}&endDate=${endDate}`);
    }

    updateActivityEvent(activityEvent: ActivityEvent): Observable<ActivityEvent> {
        return this.http.put<ActivityEvent>(`activityEvents/${activityEvent.activityEventId}`, activityEvent);
    }

    createActivityEvent(activityEvent: ActivityEvent): Observable<ActivityEvent> {
        return this.http.post<ActivityEvent>('activityEvents/', activityEvent);
    }

    volunteerForActivityEvent(volunteerForActivityEventRequest: VolunteerForActivityEventRequest): Observable<EventVolunteer[]> {
        return this.http.put<EventVolunteer[]>(`activityEvents/volunteerFor`, volunteerForActivityEventRequest);
    }
}