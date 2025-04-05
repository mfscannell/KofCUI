import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EncodedFile } from 'src/app/models/encodedFile';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { WebsiteContent } from 'src/app/models/websiteContent';
import { AssetsService } from 'src/app/services/assets.service';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private homePageCarouselImages: EncodedFile[] = [];
  public homePageCarouselImagesSources: string[] = [];
  private getWebsiteContentSubscription?: Subscription;
  private errorSaving: boolean = false;
  private errorMessages: string[] = [];

  constructor(
    public assetsService: AssetsService,
    private configsService: ConfigsService
  ) {}

  ngOnInit() {
    this.getWebsiteContent();
  }

  ngOnDestroy(): void {
    if (this.getWebsiteContentSubscription) {
      this.getWebsiteContentSubscription.unsubscribe();
    }
  }

  private getWebsiteContent() {
    console.log('homePage getWebsiteContent');
    const observer = {
      next: (websiteContent: WebsiteContent) => { 
        this.homePageCarouselImages = websiteContent.homePageCarouselImages;
        this.homePageCarouselImagesSources = this.homePageCarouselImages.map((image) => {
          return `data:${image.fileType};${image.encoding},${image.data}`;
        });
      },
      error: (err: ApiResponseError) => this.logError('Menu Error getting website content', err),
      complete: () => console.log('Webstie content retrieved.'),
    };

    this.getWebsiteContentSubscription = this.configsService.getWebsiteContent().subscribe(observer);
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    console.log('Parts of error');
    console.log(err);
    const problemDetails = err.error;

    if (problemDetails.detail) {
      this.errorMessages.push(err.error.detail);
    }

    for (const key in problemDetails.errors) {
      const errorsArray = problemDetails.errors[key];
      errorsArray.forEach(error => {
        this.errorMessages.push(error);
      })
    }

    this.errorSaving = true;
  }
}
