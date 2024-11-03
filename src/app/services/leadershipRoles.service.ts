import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LeadershipRole } from 'src/app/models/leadershipRole';
import { UpdateLeadershipRoleRequest } from '../models/requests/updateLeadershipRoleRequest';

@Injectable({
  providedIn: 'root',
})
export class LeadershipRolesService {
  constructor(private http: HttpClient) {}

  getAllLeadershipRoles(): Observable<LeadershipRole[]> {
    return this.http.get<LeadershipRole[]>('leadershipRoles');
  }

  updateLeadershipRole(request: UpdateLeadershipRoleRequest): Observable<LeadershipRole> {
    return this.http.put<LeadershipRole>(`leadershipRoles`, request);
  }
}
