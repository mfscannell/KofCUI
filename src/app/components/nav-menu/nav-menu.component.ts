import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ExternalLink } from 'src/app/models/externalLink';
import { LogInRequest } from 'src/app/models/requests/logInRequest';
import { LogInResponse } from 'src/app/models/responses/logInResponse';
import { AccountsService } from 'src/app/services/accounts.service';
import { AssetsService } from 'src/app/services/assets.service';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  public isAccountDropDownOpen = false;
  private externalLinksSubscription?: Subscription;
  private getWebsiteContentSubscription?: Subscription;
  private logInSubscription?: Subscription;
  public externalLinks: ExternalLink[] = [];
  public errorMessages: string[] = [];
  public errorLoggingIn: boolean = false;

  constructor(
    private configsService: ConfigsService,
    public accountsService: AccountsService,
    private assetsService: AssetsService,
    private router: Router) {
  }

  ngOnInit() {
    this.getAllExternalLinks();
    this.getWebsiteContent();
  }

  ngOnDestroy() {
    if (this.externalLinksSubscription) {
      this.externalLinksSubscription.unsubscribe();
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

  private getAllExternalLinks() {
    let externalLinksObserver = {
      next: (externalLinks: ExternalLink[]) => this.setExternalLinks(externalLinks),
      error: (err: any) => this.logError('Error getting all external links.', err),
      complete: () => console.log('External links loaded.')
    };
    this.externalLinksSubscription = this.configsService.getAllExternalLinks().subscribe(externalLinksObserver);
  }

  private getWebsiteContent() {
    let observer = {
      next: (externalLinks: void) => this.handleGetWebsiteContent(),
      error: (err: any) => this.logError('Error getting website content.', err),
      complete: () => console.log('Website content loaded.')
    };
    this.getWebsiteContentSubscription = this.assetsService.getAllWebsiteContent().subscribe(observer);
  }

  private setExternalLinks(externalLinks: ExternalLink[]) {
    this.externalLinks = externalLinks;
  }

  private handleGetWebsiteContent() {
  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);

    this.errorMessages = [];

    if (typeof err?.error === 'string') {
      this.errorMessages.push(err.error);
    } else {
      for (let key in err?.error?.errors) {
        this.errorMessages.push(err?.error?.errors[key][0]);
      }
    }
    
    this.errorLoggingIn = true;
  }
}
