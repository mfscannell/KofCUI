import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TenantService } from 'src/app/services/tenant.service';
import { environment } from 'src/environments/environment';
import { AccountsService } from '../services/accounts.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private tenantService: TenantService,
        private accountsService: AccountsService) {

    }

    intercept(httpRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const apiBaseUrl = environment.apiBaseUrl;
        const tenantId = this.tenantService.getTenantId();
        const url = `${apiBaseUrl}${tenantId}/${httpRequest.url}`;
        const token = this.accountsService.getToken();

        if (httpRequest.url.startsWith('assets')) {
            return next.handle(httpRequest.clone({
                url: url,
                setHeaders: {
                    'Authorization': `Bearer ${token}`
                }
            }));
        }

        return next.handle(httpRequest.clone({
            url: url,
            setHeaders: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }));
    }
}