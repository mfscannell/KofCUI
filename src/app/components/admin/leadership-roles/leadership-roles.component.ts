import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { KnightsService } from 'src/app/services/knights.service';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';
import { LeadershipRoleCategoryEnums } from 'src/app/enums/leadershipRoleCategoryEnums';

@Component({
  selector: 'kofc-leadership-roles',
  templateUrl: './leadership-roles.component.html',
  styleUrls: ['./leadership-roles.component.scss'],
})
export class LeadershipRolesComponent implements OnInit, OnDestroy {
  allKnights: Knight[] = [];
  leadershipRoles: LeadershipRole[] = [];
  leadershipRoleCategories: LeadershipRoleCategoryEnums[] = Object.values(LeadershipRoleCategoryEnums);
  knightsLoaded: boolean = false;
  knightsSubscription?: Subscription;
  leadershipRolesSubscription?: Subscription;
  leadershipRole: LeadershipRole | undefined;

  constructor(
    private knightsService: KnightsService,
    private leadershipRolesService: LeadershipRolesService,
  ) {}

  ngOnInit() {
    this.getAllActiveKnightsNames();
    this.getAllLeadershipRoles();
  }

  ngOnDestroy() {
    if (this.leadershipRolesSubscription) {
      this.leadershipRolesSubscription.unsubscribe();
    }

    if (this.knightsSubscription) {
      this.knightsSubscription.unsubscribe();
    }
  }

  private getAllActiveKnightsNames() {
    const knightsObserver = {
      next: (knights: Knight[]) => this.loadAllKnights(knights),
      error: (err: unknown) => console.log(`${err}`),
      complete: () => console.log('Knights loaded.'),
    };
    this.knightsSubscription = this.knightsService.getAllActiveKnightsNames().subscribe(knightsObserver);
  }

  private loadAllKnights(knights: Knight[]) {
    this.allKnights = knights;
    this.knightsLoaded = true;
  }

  private getAllLeadershipRoles() {
    const leadershipRolesObserver = {
      next: (leadershipRoles: LeadershipRole[]) => (this.leadershipRoles = leadershipRoles),
      error: (err: unknown) => console.log(`${err}`),
      complete: () => console.log('Leadership Roles loaded.'),
    };
    this.leadershipRolesSubscription = this.leadershipRolesService
      .getAllLeadershipRoles()
      .subscribe(leadershipRolesObserver);
  }

  filterLeadershipRoles(leadershipRoleCategory: LeadershipRoleCategoryEnums) {
    if (this.leadershipRoles) {
      return this.leadershipRoles.filter((x) => x.leadershipRoleCategory === leadershipRoleCategory);
    }

    return [];
  }

  openEditLeadershipRoleModal(leadershipRole: LeadershipRole) {
    this.leadershipRole = leadershipRole;
  }

  cancelModal() {}

  public updateLeadershipRoleInList(leadershipRole: LeadershipRole) {
    const index = this.leadershipRoles?.findIndex((x) => x.id == leadershipRole.id);

    if (this.leadershipRoles && index !== undefined && index >= 0) {
      this.leadershipRoles[index] = leadershipRole;
    }
  }
}
