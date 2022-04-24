import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ExternalLink } from 'src/app/models/externalLink';
import { LogInRequest } from 'src/app/models/requests/logInRequest';
import { LogInResponse } from 'src/app/models/responses/logInResponse';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  private externalLinksSubscription?: Subscription;
  private logInSubscription?: Subscription;
  public externalLinks: ExternalLink[] = [];
  public loginForm: FormGroup;
  public errorMessages: string[] = [];
  public errorLoggingIn: boolean = false;

  constructor(
    private configsService: ConfigsService,
    public accountsService: AccountsService) {
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit() {
    this.getAllExternalLinks();
  }

  ngOnDestroy() {
    if (this.externalLinksSubscription) {
      this.externalLinksSubscription.unsubscribe();
    }

    if (this.logInSubscription) {
      this.logInSubscription.unsubscribe();
    }
  }

  login() {
    let rawForm = this.loginForm.getRawValue();
    console.log(rawForm.username);
    console.log(rawForm.password);

    var loginRequest = new LogInRequest({
      username: rawForm.username,
      password: rawForm.password
    });
    let logInObserver = {
      next: (logInResult: void) => this.handleLogInResult(),
      error: (err: any) => this.logError('Error logging in.', err),
      complete: () => console.log('Logged In.')
    };

    this.logInSubscription = this.accountsService.login(loginRequest).subscribe(logInObserver);
  }

  private handleLogInResult() {
    this.loginForm.patchValue({
      username: '',
      password: ''
    });

    this.errorLoggingIn = false;
  }

  logout() {
    this.accountsService.logout();
  }

  private getAllExternalLinks() {
    let externalLinksObserver = {
      next: (externalLinks: ExternalLink[]) => this.setExternalLinks(externalLinks),
      error: (err: any) => this.logError('Error getting all external links.', err),
      complete: () => console.log('Activity Categories loaded.')
    };
    this.externalLinksSubscription = this.configsService.getAllExternalLinks().subscribe(externalLinksObserver);
  }

  private setExternalLinks(externalLinks: ExternalLink[]) {
    this.externalLinks = externalLinks;
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
