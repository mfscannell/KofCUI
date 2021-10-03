import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor() {

    }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var baseUrl = "https://localhost:44388/"; //TODO this should be retrieved from config.
        var url = `${baseUrl}${httpRequest.url}`;

        return next.handle(httpRequest.clone({
            url: url,
            setHeaders: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            }
        }));
    }
}