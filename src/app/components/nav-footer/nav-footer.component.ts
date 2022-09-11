import { Component, OnInit } from '@angular/core';
import { ConfigsService } from 'src/app/services/configs.service';

@Component({
  selector: 'nav-footer',
  templateUrl: './nav-footer.component.html',
  styleUrls: ['./nav-footer.component.scss']
})
export class NavFooterComponent implements OnInit {
  // facebookUrl?: string = this.configsService.getCachedWebsiteConfigs()?.facebookUrl;
  // twitterUrl?: string = this.configsService.getCachedWebsiteConfigs()?.twitterUrl;

  constructor(public configsService: ConfigsService) { }

  ngOnInit() {
  }

}
