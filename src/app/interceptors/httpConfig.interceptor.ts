import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { TenantService } from 'src/app/services/tenant.service';
import { environment } from 'src/environments/environment';
import { AccountsService } from '../services/accounts.service';
import { LogInResponse } from '../models/responses/logInResponse';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(
        private tenantService: TenantService,
        private accountsService: AccountsService) {

    }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let apiBaseUrl = environment.apiBaseUrl;
        let tenantId = this.tenantService.getTenantId();
        let url = `${apiBaseUrl}${tenantId}/${httpRequest.url}`;
        let token = this.accountsService.getToken();

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