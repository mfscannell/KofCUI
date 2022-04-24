import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountsService } from '../services/accounts.service';
import { PermissionsService } from '../services/permissions.service';

@Injectable({
  providedIn: 'root'
})

export class ActivitiesGuard implements CanActivate {
  constructor(private permissionsService: PermissionsService) {

  }

  canActivate(): boolean {
    return this.permissionsService.canActivateActivities();
  }
}