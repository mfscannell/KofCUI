import { Injectable } from "@angular/core";
import { PermissionsService } from "../services/permissions.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class MemberDuesAmountsGuard {
  constructor(
    private permissionsService: PermissionsService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    const permit = this.permissionsService.canActivateMemberDuesAmounts();

    if (permit) {
      return true;
    }

    this.router.navigateByUrl('/');
    return false;
  }
}