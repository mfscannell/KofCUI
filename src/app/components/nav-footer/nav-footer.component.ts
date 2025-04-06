import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { WebsiteContent } from 'src/app/models/websiteContent';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
    selector: 'nav-footer',
    templateUrl: './nav-footer.component.html',
    styleUrls: ['./nav-footer.component.scss'],
    standalone: false
})
export class NavFooterComponent implements OnInit, OnDestroy {
  private getWebsiteContentSubscription?: Subscription;
  public facebookUrl: string = '';
  public twitterUrl: string = '';
  public errorMessages: string[] = [];
  public errorSaving: boolean = false;

  constructor(private configsService: ConfigsService) {}

  ngOnInit() {
    this.getWebsiteContent();
  }

  ngOnDestroy(): void {
    if (this.getWebsiteContentSubscription) {
      this.getWebsiteContentSubscription.unsubscribe();
    }
  }

  private getWebsiteContent() {
    console.log('nav footer getWebsiteContent');
    const observer = {
      next: (websiteContent: WebsiteContent) => { 
        this.facebookUrl = websiteContent.facebookUrl;
        this.twitterUrl = websiteContent.twitterUrl;
      },
      error: (err: ApiResponseError) => this.logError('Footer Error getting website content', err),
      complete: () => console.log('Website content retrieved.'),
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
