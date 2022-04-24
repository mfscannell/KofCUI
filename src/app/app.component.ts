import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LogInRequest } from './models/requests/logInRequest';
import { LogInResponse } from './models/responses/logInResponse';
import { AccountsService } from './services/accounts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private accountsService: AccountsService) {
  }

  ngOnInit() {
  }
}
