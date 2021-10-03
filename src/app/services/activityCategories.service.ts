import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ActivityCategory } from 'src/app/models/activityCategory';

@Injectable({
    providedIn: 'root'
})

export class ActivityCategoriesService {
    constructor(private http: HttpClient) {

    }

    getAllActivityCategories(): Observable<ActivityCategory[]> {
        return this.http.get<ActivityCategory[]>('api/6673/activityCategories');
    }

    updateActivityCategory(updatedActivityCategory: ActivityCategory): Observable<ActivityCategory> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.put<ActivityCategory>(`api/6673/activityCategories/${updatedActivityCategory.activityCategoryId}`, updatedActivityCategory);
    }

    createActivityCategory(activityCategory: ActivityCategory): Observable<ActivityCategory> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.post<ActivityCategory>('api/6673/activityCategories/', activityCategory);
    }
}