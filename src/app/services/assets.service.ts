import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EncodedFile } from '../models/encodedFile';
import { DeleteHomePageCarouselImageResponse } from '../models/responses/deleteHomePageCarouselImageResponse';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private homePageCarouselImages: EncodedFile[] = [];
  constructor(private http: HttpClient) {}

  uploadHomePageImage(image: FormData): Observable<EncodedFile> {
    return this.http.post<EncodedFile>('assets/homePageCarouselImage', image);
  }

  deleteHomePageCarouselImage(image: string): Observable<DeleteHomePageCarouselImageResponse> {
    return this.http.delete<DeleteHomePageCarouselImageResponse>(`assets/homePageCarouselImage/${image}`);
  }

  removeHomePageCarouselImage(index: number) {
    this.homePageCarouselImages.splice(index, 1);
  }

  appendHomePageCarouselImage(image: EncodedFile) {
    this.homePageCarouselImages.push(image);
  }
}
