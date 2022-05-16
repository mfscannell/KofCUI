import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TenantService } from './services/tenant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private tenantService: TenantService,
    @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
    let goingToBasePage = this.tenantService.goingToBasePage();

    if (!goingToBasePage) {
      let tenantExists = this.tenantService.tenantExists();

      if (!tenantExists) {
        let protocol = location.protocol;
        let host = environment.domain;
        let pathname = location.pathname;
        let redirectUrl = `${protocol}//${host}${pathname}`;
        this.document.location.href = redirectUrl;
      }
    }
  }
}
