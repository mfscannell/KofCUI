import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EncodedFile } from '../models/encodedFile';
import { DeleteHomePageCarouselImageResponse } from '../models/responses/deleteHomePageCarouselImageResponse';
import { environment } from 'src/environments/environment';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private homePageCarouselImages: EncodedFile[] = [];
  private baseUrl = environment.baseUrl;
  
  constructor(
    private http: HttpClient, 
    private tenantService: TenantService, 
    private accountsService: AccountsService) {}

  uploadHomePageImage(image: FormData): Observable<EncodedFile> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<EncodedFile>(
      `${this.baseUrl}/api/${tenantId}/v1.0/assets/homePageCarouselImage`, 
      image, 
      { headers: httpHeaders });
  }

  deleteHomePageCarouselImage(image: string): Observable<DeleteHomePageCarouselImageResponse> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.delete<DeleteHomePageCarouselImageResponse>(
      `${this.baseUrl}/api/${tenantId}/v1.0/assets/homePageCarouselImage/${image}`, 
      { headers: httpHeaders });
  }

  removeHomePageCarouselImage(index: number) {
    this.homePageCarouselImages.splice(index, 1);
  }

  appendHomePageCarouselImage(image: EncodedFile) {
    this.homePageCarouselImages.push(image);
  }
}
