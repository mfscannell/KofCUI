import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExternalLink } from 'src/app/models/externalLink';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { WebsiteContent } from 'src/app/models/websiteContent';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
    selector: 'nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss'],
    standalone: false
})
export class NavMenuComponent implements OnInit, OnDestroy {
  @ViewChild('menuCollapseButton', { static: false }) menuCollapseButton: ElementRef | undefined;
  @ViewChild('navbarSupportedContent', { static: false }) navbarSupportedContent: ElementRef | undefined;
  public isAccountDropDownOpen = false;
  private getWebsiteContentSubscription?: Subscription;
  private logInSubscription?: Subscription;
  public externalLinks: ExternalLink[] = [];
  public errorMessages: string[] = [];
  public errorLoggingIn: boolean = false;

  constructor(
    private configsService: ConfigsService,
    public accountsService: AccountsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getWebsiteContent();
  }

  ngOnDestroy() {
    if (this.logInSubscription) {
      this.logInSubscription.unsubscribe();
    }

    if (this.getWebsiteContentSubscription) {
      this.getWebsiteContentSubscription.unsubscribe();
    }
  }

  public toggleCollapseMenu() {
    this.menuCollapseButton?.nativeElement.click();
  }

  public navigateToAccountClick() {
    this.router.navigate(['/account']);
  }

  public navigateToLogin() {
    this.router.navigate(['/login']);
  }

  public logout() {
    this.accountsService.logout();
    this.router.navigate(['/']);
  }

  private getWebsiteContent() {
    console.log('nav menu getWebsiteContent');
    const observer = {
      next: (websiteContent: WebsiteContent) => { 
        console.log(websiteContent);
        this.externalLinks = websiteContent.externalLinks;
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
  }
}
