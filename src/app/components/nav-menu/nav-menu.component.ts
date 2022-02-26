import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExternalLink } from 'src/app/models/externalLink';
import { ExternalLinks } from 'src/app/models/externalLinks';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  private externalLinksSubscription?: Subscription;
  public displayExternalLinks: boolean = false;
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
      next: (externalLinks: ExternalLinks) => this.setExternalLinks(externalLinks),
      error: (err: any) => this.logError('Error getting all external links.', err),
      complete: () => console.log('Activity Categories loaded.')
    };
    this.externalLinksSubscription = this.configsService.getAllExternalLinks().subscribe(externalLinksObserver);
  }

  private setExternalLinks(externalLinks: ExternalLinks) {
    this.displayExternalLinks = externalLinks.displayExternalLinks;
    this.externalLinks = externalLinks.externalLinks;
  }

  private logError(message: string, err: any) {
    console.error(message);
    console.error(err);
  }
}
