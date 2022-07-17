import { Component, OnInit } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private permissionsService: PermissionsService) { }

  ngOnInit() {
  }

  canActivateKnights() {
    return this.permissionsService.canActivateKnights();
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
