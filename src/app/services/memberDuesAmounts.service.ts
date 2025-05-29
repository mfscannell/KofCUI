import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MemberDuesAmounts } from "../models/memberDuesAmounts";
import { Observable } from "rxjs";
import { CreateMemberDuesAmountsRequest } from "../models/requests/createMemberDuesAmountsRequest";
import { UpdateMemberDuesAmountsRequest } from "../models/requests/updateMemberDuesAmountsRequest";

@Injectable({
  providedIn: 'root',
})
export class MemberDuesAmountsService {
  constructor(private http: HttpClient) {}

  getMemberDuesAmounts(fromYear?: number, toYear?: number): Observable<MemberDuesAmounts[]> {
    let questionMarkAdded = false;
    let route = 'memberDuesAmounts';

    if (fromYear) {
      route = questionMarkAdded ? `${route}&fromYear=${fromYear}` : `${route}?fromYear=${fromYear}`;
      questionMarkAdded = true;
    }

    if (toYear) {
      route = questionMarkAdded ? `${route}&toYear=${toYear}` : `${route}?toYear=${toYear}`;
      questionMarkAdded = true;
    }

    return this.http.get<MemberDuesAmounts[]>(route);
  }

  createMemberDuesAmounts(request: CreateMemberDuesAmountsRequest): Observable<MemberDuesAmounts> {
    return this.http.post<MemberDuesAmounts>('memberDuesAmounts/', request);
  }
  
  updateMemberDuesAmounts(request: UpdateMemberDuesAmountsRequest): Observable<MemberDuesAmounts> {
    return this.http.put<MemberDuesAmounts>('memberDuesAmounts/', request);
  }
}
