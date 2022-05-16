import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TenantService {
    constructor() {

    }

    getTenantId() {
        let tenantName = location.host.split('.')[0];
        let tenantId = '';
        let tenant = environment.tenants.find(t => t.tenantName === tenantName);

        if (tenant) {
            tenantId = tenant.tenantId;
        }

        return tenantId;
    }

    goingToBasePage() {
        let domains = location.host.split('.');
        let usingBasePage = domains.length === environment.numDomains - 1;

        return usingBasePage;
    }

    tenantExists() {
        let domains = location.host.split('.');
        let tenantExists = false;

        if (domains.length === environment.numDomains) {
            let tenantName = domains[0];
            let tenant = environment.tenants.find(t => t.tenantName === tenantName);

            if (tenant) {
                tenantExists = true;
            }
        }

        return tenantExists;
    }

    // getTenantForHostname(hostname: string): Tenant {
    //     return this.getTenantForHost(hostname.split(".")[0]);    
    // }
    
    // getTenantForString(s: string) {
    //     for (const e in Tenant) {
    //         if (e.toLowerCase() === s.toLowerCase()) {
    //         return Tenant[e] as Tenant;
    //         }
    //     }
    //     return null;
    // }

    // getTenantForHost(host: string): Tenant {
    // return this.getTenantForString(host);
    // }

    // getTenant(): Tenant {
    // return this.getTenantForHostname(location.hostname);
    // }

    // addTenantToHeaders(headers: HttpHeaders): HttpHeaders {
    // return headers.append("X-Tenant-ID", this.getTenant());
    // }
}