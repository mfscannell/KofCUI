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
        return this.http.get<ActivityCategory[]>('activityCategories');
    }

    updateActivityCategory(updatedActivityCategory: ActivityCategory): Observable<ActivityCategory> {
        return this.http.put<ActivityCategory>(`activityCategories/${updatedActivityCategory.activityCategoryId}`, updatedActivityCategory);
    }

    createActivityCategory(activityCategory: ActivityCategory): Observable<ActivityCategory> {
        return this.http.post<ActivityCategory>('activityCategories/', activityCategory);
    }
}