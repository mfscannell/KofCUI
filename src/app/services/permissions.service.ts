import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LogInRequest } from '../models/requests/logInRequest';
import { LogInResponse } from '../models/responses/logInResponse';
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

  constructor(private accountsService: AccountsService) {

  }

  canActivateAccount() {
    let token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  canActivateAdmin() {
    let token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  canActivateKnights() {
    let roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole) || roles.includes(this.financialSecretaryRole)) {
      return true;
    }

    return false;
  }

  canActivateLeadershipRoles() {
    let roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return true;
    }

    return false;
  }

  canActivateActivities() {
    let roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return true;
    }

    let isActivityCoordinator = false;

    roles.forEach(r => {
      if (r.startsWith('__ActivityCoordinator__')) {
        let id = r.substring(23);

        if (Number(id) !== NaN) {
          isActivityCoordinator = true;
        }
      }
    });

    return isActivityCoordinator;
  }

  canAddActivityCategory() {
    let roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole);
  }

  canAddActivity() {
    let roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole);
  }

  canEditActivity(activityId?: number) {
    let roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) 
    || roles.includes(this.grandKnightRole) 
    || roles.includes(this.deputyGrandKnightRole) 
    || roles.includes(`__ActivityCoordinator__${activityId}`);
  }

  canActivateActiviyEvents() {
    let token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  canAddEvent(activities: Activity[]) {
    let roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
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

  canEditEvent(activityId: number) {
    let roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) 
    || roles.includes(this.grandKnightRole) 
    || roles.includes(this.deputyGrandKnightRole) 
    || roles.includes(`__ActivityCoordinator__${activityId}`);
  }

  filterActivitiesByEventCreation(activities: Activity[]) {
    let roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return activities;
    }

    let filteredActivities: Activity[]= [];

    activities.forEach(a => {
      if (roles.includes(`__ActivityCoordinator__${a.activityId}`)) {
        filteredActivities.push(a);
      }
    });

    return filteredActivities;
  }

  canActivateConfigs() {
    let roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return true;
    }

    return false;
  }
}