import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ExternalLink } from 'src/app/models/externalLink';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
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
  private getWebsiteTextSubscription?: Subscription;
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
    if (this.configsService.hasCachedWebsiteConfigs()) {
      this.externalLinks = this.configsService.getCachedWebsiteConfigs()?.externalLinks || [];
    } else {
      this.getWebsiteText();
    }
    this.getWebsiteContent();
  }

  ngOnDestroy() {
    if (this.getWebsiteTextSubscription) {
      this.getWebsiteTextSubscription.unsubscribe();
    }

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

  private getWebsiteText() {
    const websiteTextObserver = {
      next: () => this.handleGetWebsiteTextResult(),
      error: (err: ApiResponseError) => this.logError('Error getting all website text.', err),
      complete: () => console.log('Website text loaded.'),
    };
    this.getWebsiteTextSubscription = this.configsService.getAllWebsiteConfigs().subscribe(websiteTextObserver);
  }

  private handleGetWebsiteTextResult() {
    this.externalLinks = this.configsService.getCachedWebsiteConfigs()?.externalLinks || [];
  }

  private getWebsiteContent() {
    const observer = {
      next: () => this.handleGetWebsiteContent(),
      error: (err: ApiResponseError) => this.logError('Error getting website content.', err),
      complete: () => console.log('Website content loaded.'),
    };
    this.getWebsiteContentSubscription = this.assetsService.getAllWebsiteContent().subscribe(observer);
  }

  private handleGetWebsiteContent() {}

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (const key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }

    this.errorLoggingIn = true;
  }
}
