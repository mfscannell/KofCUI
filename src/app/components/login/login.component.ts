import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogInRequest } from 'src/app/models/requests/logInRequest';
import { ApiResponseError } from 'src/app/models/responses/apiResponseError';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'kofc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: UntypedFormGroup;
  public errorMessages: string[] = [];
  private logInSubscription?: Subscription;
  public errorLoggingIn: boolean = false;

  constructor(
    private accountsService: AccountsService,
    private router: Router) {
    this.loginForm = new UntypedFormGroup({
      username: new UntypedFormControl(),
      password: new UntypedFormControl()
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.logInSubscription) {
      this.logInSubscription.unsubscribe();
    }
  }

  login() {
    const rawForm = this.loginForm.getRawValue();

    const loginRequest: LogInRequest = {
      username: rawForm.username,
      password: rawForm.password
    };
    const logInObserver = {
      next: () => this.handleLogInResult(),
      error: (err: ApiResponseError) => this.logError('Error logging in.', err),
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
    this.router.navigate(['/']);
  }

  private logError(message: string, err: ApiResponseError) {
    console.error(message);
    console.error(err);
    this.loginForm.patchValue({password: ''});

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
