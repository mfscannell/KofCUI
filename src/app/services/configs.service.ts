import { Observable, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TenantConfig } from '../models/tenantConfig';
import { WebsiteContent } from '../models/websiteContent';

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  private websiteContent?: Observable<WebsiteContent>;
  private isWebSiteContentStale: boolean = true;

  constructor(private http: HttpClient) {}

  getAllConfig(): Observable<TenantConfig> {
    return this.http.get<TenantConfig>('configs');
  }

  updateConfigSettings(updatedConfigs: TenantConfig): Observable<TenantConfig> {
    return this.http.put<TenantConfig>('configs', updatedConfigs);
  }

  public getWebsiteContent(): Observable<WebsiteContent> {
    console.log(`getWebsiteContent: [${this.isWebSiteContentStale}]`);

    if (!this.websiteContent || this.isWebSiteContentStale) {
      console.log('no website content cached');
      this.websiteContent = this.http
        .get<WebsiteContent>('configs/websiteContent')
        .pipe(shareReplay());
    }

    this.isWebSiteContentStale = false;

    return this.websiteContent;
  }

  public flagWebsiteContentStale() {
    this.isWebSiteContentStale = true;
  }
}
