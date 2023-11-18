import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Knight } from 'src/app/models/knight';
import { ActivityInterest } from 'src/app/models/activityInterest'
import { UpdateKnightActivityInterestsRequest } from '../models/requests/updateKnightActivityInterestsRequest';
import { UpdateKnightPasswordRequest } from '../models/requests/updateKnightPasswordRequest';
import { UpdateKnightPasswordResponse } from '../models/responses/updateKnightPasswordResponse';
import { UpdateKnightAndActivityInterestsRequest } from '../models/requests/updateKnightAndActivityInterestsRequest';
import { KnightUser } from '../models/knightUser';
import { UpdateKnightPersonalInfoRequest } from '../models/requests/updateKnightPersonalInfoRequest';
import { KnightInfo } from '../models/knightInfo';
import { MemberDues } from '../models/memberDues';
import { UpdateKnightMembershipInfoRequest } from '../models/requests/updateKnightMembershipInfoRequest';
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