import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

@Injectable({
  providedIn: 'root',
})
export class KnightsGuard {
  constructor(
    private permissionsService: PermissionsService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const permit = this.permissionsService.canActivateKnights();

    if (permit) {
      return true;
    }

    this.router.navigateByUrl('/');
    return false;
  }
}
