import { Injectable } from '@angular/core';

import { AccountsService } from './accounts.service';
import { Activity } from '../models/activity';

@Injectable({
  providedIn: 'root',
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

  constructor(private accountsService: AccountsService) {}

  public canActivateAccount(): boolean {
    const token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  public canActivateAdmin(): boolean {
    const token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  public canActivateKnights(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.financialSecretaryRole)
    ) {
      return true;
    }

    return false;
  }

  public canActivateLeadershipRoles(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole)
    ) {
      return true;
    }

    return false;
  }

  public canActivateActivities(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.programDirectorRole) ||
      roles.includes(this.communityDirectorRole) ||
      roles.includes(this.faithDirectorRole) ||
      roles.includes(this.familyDirectorRole) ||
      roles.includes(this.lifeDirectorRole)
    ) {
      return true;
    }

    let isActivityCoordinator = false;

    roles.forEach((r) => {
      if (r.startsWith('__ActivityCoordinator__')) {
        const id = r.substring(23);

        if (!Number.isNaN(id)) {
          isActivityCoordinator = true;
        }
      }
    });

    return isActivityCoordinator;
  }

  public canAddActivity(): boolean {
    const roles = this.accountsService.getRoles();

    return (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.programDirectorRole) ||
      roles.includes(this.communityDirectorRole) ||
      roles.includes(this.faithDirectorRole) ||
      roles.includes(this.familyDirectorRole) ||
      roles.includes(this.lifeDirectorRole)
    );
  }

  public canEditActivity(activityId?: string): boolean {
    const roles = this.accountsService.getRoles();

    return (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.programDirectorRole) ||
      roles.includes(this.communityDirectorRole) ||
      roles.includes(this.faithDirectorRole) ||
      roles.includes(this.familyDirectorRole) ||
      roles.includes(this.lifeDirectorRole) ||
      roles.includes(`__ActivityCoordinator__${activityId}`)
    );
  }

  public canActivateActiviyEvents(): boolean {
    //TODO MFS need to edit
    // let token = this.accountsService.getToken();

    // return token !== undefined && token !== '';
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.programDirectorRole) ||
      roles.includes(this.communityDirectorRole) ||
      roles.includes(this.faithDirectorRole) ||
      roles.includes(this.familyDirectorRole) ||
      roles.includes(this.lifeDirectorRole)
    ) {
      return true;
    }

    let isActivityCoordinator = false;

    roles.forEach((r) => {
      if (r.startsWith('__ActivityCoordinator__')) {
        const id = r.substring(23);

        if (!Number.isNaN(id)) {
          isActivityCoordinator = true;
        }
      }
    });

    return isActivityCoordinator;
  }

  public canActivateEventVolunteering(): boolean {
    const token = this.accountsService.getToken();

    return token !== undefined && token !== '';
  }

  public canAddEvent(activities: Activity[]): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.programDirectorRole) ||
      roles.includes(this.communityDirectorRole) ||
      roles.includes(this.faithDirectorRole) ||
      roles.includes(this.familyDirectorRole) ||
      roles.includes(this.lifeDirectorRole)
    ) {
      return true;
    }

    let isActivityCoordinator = false;

    activities.forEach((a) => {
      if (roles.includes(`__ActivityCoordinator__${a.activityId}`)) {
        isActivityCoordinator = true;
      }
    });

    return isActivityCoordinator;
  }

  public canEditEvent(activityId: string): boolean {
    const roles = this.accountsService.getRoles();

    return (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.programDirectorRole) ||
      roles.includes(this.communityDirectorRole) ||
      roles.includes(this.faithDirectorRole) ||
      roles.includes(this.familyDirectorRole) ||
      roles.includes(this.lifeDirectorRole) ||
      roles.includes(`__ActivityCoordinator__${activityId}`)
    );
  }

  public filterActivitiesByEventCreation(activities: Activity[]): Activity[] {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.programDirectorRole) ||
      roles.includes(this.communityDirectorRole) ||
      roles.includes(this.faithDirectorRole) ||
      roles.includes(this.familyDirectorRole) ||
      roles.includes(this.lifeDirectorRole)
    ) {
      return activities;
    }

    const filteredActivities: Activity[] = [];

    activities.forEach((a) => {
      if (roles.includes(`__ActivityCoordinator__${a.activityId}`)) {
        filteredActivities.push(a);
      }
    });

    return filteredActivities;
  }

  public canActivateConfigs(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole)
    ) {
      return true;
    }

    return false;
  }

  public canActivateAssets(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole)
    ) {
      return true;
    }

    return false;
  }

  public canActivateMemberDuesAmounts(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.financialSecretaryRole)
    ) {
      return true;
    }

    return false;
  }

  public canAddMemberDuesAmounts(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.financialSecretaryRole)
    ) {
      return true;
    }

    return false;
  }

  public canEditMemberDuesAmounts(): boolean {
    const roles = this.accountsService.getRoles();

    if (
      roles.includes(this.adminRole) ||
      roles.includes(this.grandKnightRole) ||
      roles.includes(this.deputyGrandKnightRole) ||
      roles.includes(this.financialSecretaryRole)
    ) {
      return true;
    }

    return false;
  }
}
