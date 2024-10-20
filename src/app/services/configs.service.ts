import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigGroup } from 'src/app/models/configGroup';
import { ConfigSetting } from 'src/app/models/configSetting';
import { TimeZoneFormOption } from '../models/inputOptions/timeZoneFormOption';
import { WebsiteConfigs } from '../models/websiteConfigs';

@Injectable({
    providedIn: 'root'
})

export class ConfigsService {
    private allWebsiteConfigs?: WebsiteConfigs;

    constructor(private http: HttpClient) {

    }

    getAllConfigGroups(): Observable<ConfigGroup[]> {
        return this.http.get<ConfigGroup[]>('configs');
    }

    updateConfigSettings(updatedConfigs: ConfigSetting[]): Observable<ConfigSetting[]> {
        return this.http.put<ConfigSetting[]>('configs', updatedConfigs);
    }

    getAllWebsiteConfigs(): Observable<void> {
        return this.http.get<WebsiteConfigs>('configs/allWebsiteConfigs').pipe(
            map((response: WebsiteConfigs) => {
              this.allWebsiteConfigs = response;
            })
          );
    }

    getCachedWebsiteConfigs() {
        return this.allWebsiteConfigs;
    }

    hasCachedWebsiteConfigs() {
        return this.allWebsiteConfigs !== undefined;
    }

    getCouncilTimeZone(): Observable<TimeZoneFormOption> {
        return this.http.get<TimeZoneFormOption>('configs/councilTimeZone');
    }
}