import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TenantService } from './services/tenant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private tenantService: TenantService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit() {
    const goingToBasePage = this.tenantService.goingToBasePage();

    if (!goingToBasePage) {
      const tenantExists = this.tenantService.tenantExists();

      if (!tenantExists) {
        const protocol = location.protocol;
        const host = environment.domain;
        const pathname = location.pathname;
        const redirectUrl = `${protocol}//${host}${pathname}`;
        this.document.location.href = redirectUrl;
      }
    }
  }
}
