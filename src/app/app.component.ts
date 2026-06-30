import { Component, Inject, OnInit, DOCUMENT, ChangeDetectionStrategy } from '@angular/core';
import { TenantService } from './services/tenant.service';
import { environment } from '@env/environment';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { NavFooterComponent } from './components/nav-footer/nav-footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent, NavFooterComponent],
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
