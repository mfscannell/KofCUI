import { Injectable } from '@angular/core';

import { AccountsService } from './accounts.service';
import { Activity } from '../models/activity';

@Injectable({
    providedIn: 'root'
})

export class PermissionsService {
  private adminRole: string = 'Admin';
  private grandKnightRole: string = 'Grand Knight';
  private deputyGrandKnightRole: string = 'Deputy Grand Knight';
  private financialSecretaryRole: string = 'Financial Secretary';
  private programDirectorRole: string = 'Program Director';
  private communityDirectorRole: string = 'Community Director';
  private faithDirectorRole: string = 'Faith Director';
  private familyDirectorRole: string = 'Family Director';
  private lifeDirectorRole: string = 'Life Director';

  constructor(private accountsService: AccountsService) {

  }

  canActivateAccount() {
    const token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  canActivateAdmin() {
    const token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  canActivateKnights() {
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole) || roles.includes(this.financialSecretaryRole)) {
      return true;
    }

    return false;
  }

  canActivateLeadershipRoles() {
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return true;
    }

    return false;
  }

  canActivateActivities() {
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || 
        roles.includes(this.grandKnightRole) || 
        roles.includes(this.deputyGrandKnightRole) || 
        roles.includes(this.programDirectorRole) || 
        roles.includes(this.communityDirectorRole) || 
        roles.includes(this.faithDirectorRole) || 
        roles.includes(this.familyDirectorRole) || 
        roles.includes(this.lifeDirectorRole)) {
      return true;
    }

    let isActivityCoordinator = false;

    roles.forEach(r => {
      if (r.startsWith('__ActivityCoordinator__')) {
        const id = r.substring(23);

        if (!Number.isNaN(id)) {
          isActivityCoordinator = true;
        }
      }
    });

    return isActivityCoordinator;
  }

  canAddActivity() {
    const roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) ||
        roles.includes(this.grandKnightRole) ||
        roles.includes(this.deputyGrandKnightRole) ||
        roles.includes(this.programDirectorRole) || 
        roles.includes(this.communityDirectorRole) || 
        roles.includes(this.faithDirectorRole) || 
        roles.includes(this.familyDirectorRole) || 
        roles.includes(this.lifeDirectorRole);
  }

  canEditActivity(activityId?: string) {
    const roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) || 
        roles.includes(this.grandKnightRole) || 
        roles.includes(this.deputyGrandKnightRole) || 
        roles.includes(this.programDirectorRole) || 
        roles.includes(this.communityDirectorRole) || 
        roles.includes(this.faithDirectorRole) || 
        roles.includes(this.familyDirectorRole) || 
        roles.includes(this.lifeDirectorRole) ||
        roles.includes(`__ActivityCoordinator__${activityId}`);
  }

  canActivateActiviyEvents() {
    //TODO need to edit
    // let token = this.accountsService.getToken();

    // return token !== undefined && token !== '';
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || 
        roles.includes(this.grandKnightRole) || 
        roles.includes(this.deputyGrandKnightRole) || 
        roles.includes(this.programDirectorRole) || 
        roles.includes(this.communityDirectorRole) || 
        roles.includes(this.faithDirectorRole) || 
        roles.includes(this.familyDirectorRole) || 
        roles.includes(this.lifeDirectorRole)) {
      return true;
    }

    let isActivityCoordinator = false;

    roles.forEach(r => {
      if (r.startsWith('__ActivityCoordinator__')) {
        const id = r.substring(23);

        if (!Number.isNaN(id)) {
          isActivityCoordinator = true;
        }
      }
    });

    return isActivityCoordinator;
  }

  canActivateEventVolunteering() {
    const token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  canAddEvent(activities: Activity[]) {
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || 
        roles.includes(this.grandKnightRole) || 
        roles.includes(this.deputyGrandKnightRole) || 
        roles.includes(this.programDirectorRole) || 
        roles.includes(this.communityDirectorRole) || 
        roles.includes(this.faithDirectorRole) || 
        roles.includes(this.familyDirectorRole) || 
        roles.includes(this.lifeDirectorRole)) {
      return true;
    }

    let isActivityCoordinator = false;

    activities.forEach(a => {
      if (roles.includes(`__ActivityCoordinator__${a.activityId}`)) {
        isActivityCoordinator = true;
      }
    });

    return isActivityCoordinator;
  }

  canEditEvent(activityId: string) {
    const roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) 
    || roles.includes(this.grandKnightRole) 
    || roles.includes(this.deputyGrandKnightRole) 
    || roles.includes(this.programDirectorRole)
    || roles.includes(this.communityDirectorRole)
    || roles.includes(this.faithDirectorRole)
    || roles.includes(this.familyDirectorRole)
    || roles.includes(this.lifeDirectorRole)
    || roles.includes(`__ActivityCoordinator__${activityId}`);
  }

  filterActivitiesByEventCreation(activities: Activity[]) {
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) ||
        roles.includes(this.grandKnightRole) ||
        roles.includes(this.deputyGrandKnightRole) ||
        roles.includes(this.programDirectorRole) || 
        roles.includes(this.communityDirectorRole) || 
        roles.includes(this.faithDirectorRole) || 
        roles.includes(this.familyDirectorRole) || 
        roles.includes(this.lifeDirectorRole)) {
      return activities;
    }

    const filteredActivities: Activity[]= [];

    activities.forEach(a => {
      if (roles.includes(`__ActivityCoordinator__${a.activityId}`)) {
        filteredActivities.push(a);
      }
    });

    return filteredActivities;
  }

  canActivateConfigs() {
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return true;
    }

    return false;
  }

  canActivateAssets() {
    const roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return true;
    }

    return false;
  }
}