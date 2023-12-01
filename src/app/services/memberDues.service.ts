import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MemberDues } from '../models/memberDues';
import { UpdateKnightMemberDuesRequest } from '../models/requests/updateKnightMemberDuesRequest';

@Injectable({
    providedIn: 'root'
})

export class MemberDuesService {
    constructor(private http: HttpClient) {

    }

    updateKnightMemberDues(knightMemberDues: UpdateKnightMemberDuesRequest): Observable<MemberDues[]> {
        return this.http.put<MemberDues[]>(`memberDues/forKnight`, knightMemberDues);
    }
}