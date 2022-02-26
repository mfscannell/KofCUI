import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigGroup } from 'src/app/models/configGroup';
import { ConfigSetting } from 'src/app/models/configSetting';
import { ExternalLinks } from '../models/externalLinks';

@Injectable({
    providedIn: 'root'
})

export class ConfigsService {
    constructor(private http: HttpClient) {

    }

    getAllConfigGroups(): Observable<ConfigGroup[]> {
        return this.http.get<ConfigGroup[]>('configs');
    }

    updateConfigSettings(updatedConfigs: ConfigSetting[]): Observable<ConfigSetting[]> {
        return this.http.put<ConfigSetting[]>('configs', updatedConfigs);
    }

    getAllExternalLinks(): Observable<ExternalLinks> {
        return this.http.get<ExternalLinks>('configs/externalLinks');
    }
}