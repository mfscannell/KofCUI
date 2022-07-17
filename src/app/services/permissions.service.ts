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
  private programDirectorRole: string = 'Program Director';
  private communityDirectorRole: string = 'Community Director';
  private faithDirectorRole: string = 'Faith Director';
  private familyDirectorRole: string = 'Family Director';
  private lifeDirectorRole: string = 'Life Director';

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
        let id = r.substring(23);

        if (Number(id) !== NaN) {
          isActivityCoordinator = true;
        }
      }
    });

    return isActivityCoordinator;
  }

  canAddActivity() {
    let roles = this.accountsService.getRoles();

    return roles.includes(this.adminRole) ||
        roles.includes(this.grandKnightRole) ||
        roles.includes(this.deputyGrandKnightRole) ||
        roles.includes(this.programDirectorRole) || 
        roles.includes(this.communityDirectorRole) || 
        roles.includes(this.faithDirectorRole) || 
        roles.includes(this.familyDirectorRole) || 
        roles.includes(this.lifeDirectorRole);
  }

  canEditActivity(activityId?: number) {
    let roles = this.accountsService.getRoles();

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
    let roles = this.accountsService.getRoles();

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
        let id = r.substring(23);

        if (Number(id) !== NaN) {
          isActivityCoordinator = true;
        }
      }
    });

    return isActivityCoordinator;
  }

  canActivateEventVolunteering() {
    let token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  canAddEvent(activities: Activity[]) {
    let roles = this.accountsService.getRoles();

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

  canEditEvent(activityId: number) {
    let roles = this.accountsService.getRoles();

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
    let roles = this.accountsService.getRoles();

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

  canActivateAssets() {
    let roles = this.accountsService.getRoles();

    if (roles.includes(this.adminRole) || roles.includes(this.grandKnightRole) || roles.includes(this.deputyGrandKnightRole)) {
      return true;
    }

    return false;
  }
}