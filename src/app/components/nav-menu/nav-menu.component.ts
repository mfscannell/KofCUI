import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExternalLink } from 'src/app/models/externalLink';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  private externalLinksSubscription?: Subscription;
  public externalLinks: ExternalLink[] = [];

  constructor(private configsService: ConfigsService) { }

  ngOnInit() {
    this.getAllExternalLinks();
  }

  ngOnDestroy() {
    if (this.externalLinksSubscription) {
      this.externalLinksSubscription.unsubscribe();
    }
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
  }
}
