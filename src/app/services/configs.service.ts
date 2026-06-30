import { Observable, shareReplay } from 'rxjs';
import { inject, Service } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TenantConfig } from '../models/tenantConfig';
import { WebsiteContent } from '../models/websiteContent';
import { environment } from '@env/environment';
import { TenantService } from './tenant.service';
import { AccountsService } from './accounts.service';

@Service()
export class ConfigsService {
  private websiteContent?: Observable<WebsiteContent>;
  private isWebSiteContentStale: boolean = true;
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient); 
  private tenantService = inject(TenantService); 
  private accountsService = inject(AccountsService);

  public getAllConfig(): Observable<TenantConfig> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<TenantConfig>(
      `${this.baseUrl}/api/${tenantId}/v1.0/configs`, 
      { headers: httpHeaders });
  }

  public updateConfigSettings(updatedConfigs: TenantConfig): Observable<TenantConfig> {
    const tenantId = this.tenantService.getTenantId();
    const token = this.accountsService.getToken();
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<TenantConfig>(
      `${this.baseUrl}/api/${tenantId}/v1.0/configs`, 
      updatedConfigs, 
      { headers: httpHeaders });
  }

  public getWebsiteContent(): Observable<WebsiteContent> {
    console.log(`getWebsiteContent: [${this.isWebSiteContentStale}]`);

    if (!this.websiteContent || this.isWebSiteContentStale) {
      const tenantId = this.tenantService.getTenantId();
      const token = this.accountsService.getToken();
      const httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      console.log('no website content cached');
      this.websiteContent = this.http
        .get<WebsiteContent>(
          `${this.baseUrl}/api/${tenantId}/v1.0/configs/websiteContent`, 
          { headers: httpHeaders })
        .pipe(shareReplay());
    }

    this.isWebSiteContentStale = false;

    return this.websiteContent;
  }

  public flagWebsiteContentStale() {
    this.isWebSiteContentStale = true;
  }
}
