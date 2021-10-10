import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { TenantService } from 'src/app/services/tenant.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private tenantService: TenantService) {

    }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let apiBaseUrl = environment.apiBaseUrl;
        let tenantId = this.tenantService.getTenantId();
        let url = `${apiBaseUrl}${tenantId}/${httpRequest.url}`;

        return next.handle(httpRequest.clone({
            url: url,
            setHeaders: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            }
        }));
    }
}