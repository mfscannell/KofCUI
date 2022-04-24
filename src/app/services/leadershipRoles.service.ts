import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LeadershipRole } from 'src/app/models/leadershipRole';
import { LeadershipRoleCategory } from '../models/leadershipRoleCategory';

@Injectable({
    providedIn: 'root'
})

export class LeadershipRolesService {
    constructor(private http: HttpClient) {

    }

    getAllLeadershipRoles(): Observable<LeadershipRoleCategory[]> {
        return this.http.get<LeadershipRoleCategory[]>('leadershipRoles');
    }

    updateLeadershipRole(updatedLeadershipRole: LeadershipRole): Observable<LeadershipRole> {
        return this.http.put<LeadershipRole>(`leadershipRoles/${updatedLeadershipRole.leadershipRoleId}`, updatedLeadershipRole);
    }

    createLeadershipRole(leadershipRole: LeadershipRole): Observable<LeadershipRole> {
        return this.http.post<LeadershipRole>('leadershipRoles/', leadershipRole);
    }
}