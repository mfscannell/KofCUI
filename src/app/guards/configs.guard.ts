import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountsService } from '../services/accounts.service';
import { PermissionsService } from '../services/permissions.service';

@Injectable({
  providedIn: 'root'
})

export class ConfigsGuard implements CanActivate {
  constructor(
    private permissionsService: PermissionsService,
    private router: Router) {

  }

  canActivate(): boolean {
    let permit = this.permissionsService.canActivateConfigs();

    if (permit) {
      return true;
    }

    this.router.navigateByUrl('/');
    return false;
  }
}