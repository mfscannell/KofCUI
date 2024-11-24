import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ExternalLink } from 'src/app/models/externalLink';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { WebsiteContent } from 'src/app/models/websiteContent';
import { AccountsService } from 'src/app/services/accounts.service';
import { AssetsService } from 'src/app/services/assets.service';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  public isAccountDropDownOpen = false;
  private getWebsiteContentSubscription?: Subscription;
  private logInSubscription?: Subscription;
  public externalLinks: ExternalLink[] = [];
  public errorMessages: string[] = [];
  public errorLoggingIn: boolean = false;

  constructor(
    private configsService: ConfigsService,
    public accountsService: AccountsService,
    private assetsService: AssetsService,
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

  navigateToAccountClick(dropDown: NgbDropdown) {
    dropDown.close();
    this.isMenuCollapsed = true;
  }

  navigateToLogin(dropDown: NgbDropdown) {
    dropDown.close();
    this.router.navigate(['/login']);
    this.isMenuCollapsed = true;
  }

  logout(dropDown: NgbDropdown) {
    dropDown.close();
    this.accountsService.logout();
    this.router.navigate(['/']);
    this.isMenuCollapsed = true;
  }

  private getWebsiteContent() {
    console.log('nav menu getWebsiteContent');
    const observer = {
      next: (websiteContent: WebsiteContent) => { 
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

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else if (Array.isArray(err?.error)) {
      err?.error.forEach((e: string) => {
        this.errorMessages.push(e);
      });
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }

    this.errorLoggingIn = true;
  }
}
