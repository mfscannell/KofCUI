import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WebsiteConfigs } from '../models/websiteConfigs';
import { GenericFormOption } from '../models/inputOptions/genericFormOption';
import { TenantConfig } from '../models/tenantConfig';

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  private allWebsiteConfigs?: WebsiteConfigs;

  constructor(private http: HttpClient) {}

  getAllConfig(): Observable<TenantConfig> {
    return this.http.get<TenantConfig>('configs');
  }

  updateConfigSettings(updatedConfigs: TenantConfig): Observable<TenantConfig> {
    return this.http.put<TenantConfig>('configs', updatedConfigs);
  }

  getAllWebsiteConfigs(): Observable<void> {
    return this.http.get<WebsiteConfigs>('configs/allWebsiteConfigs').pipe(
      map((response: WebsiteConfigs) => {
        this.allWebsiteConfigs = response;
      }),
    );
  }

  getCachedWebsiteConfigs() {
    return this.allWebsiteConfigs;
  }

  hasCachedWebsiteConfigs() {
    return this.allWebsiteConfigs !== undefined;
  }

  getCouncilTimeZone(): Observable<GenericFormOption> {
    return this.http.get<GenericFormOption>('configs/councilTimeZone');
  }
}
