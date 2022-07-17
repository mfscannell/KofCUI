import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EncodedFile } from '../models/encodedFile';
import { GetAllWebsiteContentResponse } from '../models/responses/getAllWebsiteContentResponse';
import { ExternalLink } from '../models/externalLink';

@Injectable({
    providedIn: 'root'
})

export class AssetsService {
    private homePageCarouselImages: EncodedFile[] = [];
    constructor(private http: HttpClient) {

    }

    getAllWebsiteContent() {
        return this.http.get<GetAllWebsiteContentResponse>('assets/allWebsiteContent').pipe(
            map((response: GetAllWebsiteContentResponse) => {
                this.homePageCarouselImages = response.homePageCarouselImages;
            })
          )
    }

    uploadHomePageImage(image: FormData): Observable<EncodedFile> {
        return this.http.post<EncodedFile>('assets/homePageCarouselImage', image);
    }

    getHomePageCarouselImages() {
        return this.homePageCarouselImages;
    }

    appendHomePageCarouselImage(image: EncodedFile) {
        this.homePageCarouselImages.push(image);
    }
}