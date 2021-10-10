import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LeadershipRoleCategory } from 'src/app/models/leadershipRoleCategory';

@Injectable({
    providedIn: 'root'
})

export class LeadershipRoleCategoriesService {
    constructor(private http: HttpClient) {

    }

    getAllLeadershipRoleCategories(): Observable<LeadershipRoleCategory[]> {
        return this.http.get<LeadershipRoleCategory[]>('leadershipRoleCategories');
    }

    updateLeadershipRoleCategory(updatedleadershipRoleCategory: LeadershipRoleCategory): Observable<LeadershipRoleCategory> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.put<LeadershipRoleCategory>(`leadershipRoleCategories/${updatedleadershipRoleCategory.leadershipRoleCategoryId}`, updatedleadershipRoleCategory);
    }

    createLeadershipRoleCategory(leadershipRoleCategory: LeadershipRoleCategory): Observable<LeadershipRoleCategory> {
        //TODO all routes should pull the council ID from somewhere
        return this.http.post<LeadershipRoleCategory>('leadershipRoleCategories/', leadershipRoleCategory);
    }
}