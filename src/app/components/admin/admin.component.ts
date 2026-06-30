import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { PermissionsService } from '@app/services/permissions.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink],
})
export class AdminComponent implements OnInit {
  private permissionsService = inject(PermissionsService);

  ngOnInit() {}

  canActivateKnights() {
    return this.permissionsService.canActivateKnights();
  }

  canActivateMemberDuesAmounts() {
    return this.permissionsService.canActivateMemberDuesAmounts();
  }

  canActivateLeadershipRoles() {
    return this.permissionsService.canActivateLeadershipRoles();
  }

  canActivateActivities() {
    return this.permissionsService.canActivateActivities();
  }

  canActivateActiviyEvents() {
    return this.permissionsService.canActivateActiviyEvents();
  }

  canActivateEventVolunteering() {
    return this.permissionsService.canActivateEventVolunteering();
  }

  canActivateConfigs() {
    return this.permissionsService.canActivateConfigs();
  }

  canActivateAssets() {
    return this.permissionsService.canActivateAssets();
  }
}
