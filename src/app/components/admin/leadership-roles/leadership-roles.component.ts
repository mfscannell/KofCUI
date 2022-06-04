import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { EditLeadershipRoleModalComponent } from 'src/app/components/admin/leadership-roles/edit-leadership-role-modal/edit-leadership-role-modal.component';
import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { KnightsService } from 'src/app/services/knights.service';
import { LeadershipRolesService } from 'src/app/services/leadershipRoles.service';
import { LeadershipRoleCategoryEnums } from 'src/app/enums/leadershipRoleCategoryEnums';


@Component({
  selector: 'kofc-leadership-roles',
  templateUrl: './leadership-roles.component.html',
  styleUrls: ['./leadership-roles.component.css']
})
export class LeadershipRolesComponent implements OnInit, OnDestroy {
  allKnights: Knight[] = [];
  leadershipRoles: LeadershipRole[] = [];
  leadershipRoleCategories: LeadershipRoleCategoryEnums[] = Object.values(LeadershipRoleCategoryEnums);
  knightsLoaded: boolean = false;
  knightsSubscription?: Subscription;
  leadershipRolesSubscription?: Subscription;
  closeModalResult = '';

  constructor(private knightsService: KnightsService,
    private leadershipRolesService: LeadershipRolesService,
    private modalService: NgbModal) {

    }

  ngOnInit() {
    this.getAllKnightsNames();
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

  private getAllKnightsNames() {
    let knightsObserver = {
      next: (knights: Knight[]) => this.loadAllKnights(knights),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Knights loaded.')
    };
    this.knightsSubscription = this.knightsService.getAllKnightsNames().subscribe(knightsObserver);
  }

  private loadAllKnights(knights: Knight[]) {
    this.allKnights = knights;
    this.knightsLoaded = true;
  }

  private getAllLeadershipRoles() {
    let leadershipRolesObserver = {
      next: (leadershipRoles: LeadershipRole[]) => this.leadershipRoles = leadershipRoles,
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Roles loaded.')
    };
    this.leadershipRolesSubscription = this.leadershipRolesService.getAllLeadershipRoles().subscribe(leadershipRolesObserver);
  }

  filterLeadershipRoles(leadershipRoleCategory: LeadershipRoleCategoryEnums) {
    if (this.leadershipRoles) {
      return this.leadershipRoles.filter(x => x.leadershipRoleCategory === leadershipRoleCategory);
    }

    return [];
  }

  openEditLeadershipRoleModal(leadershipRole: LeadershipRole) {
    const modalRef = this.modalService.open(EditLeadershipRoleModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.allKnights = this.allKnights;
    modalRef.componentInstance.leadershipRole = leadershipRole;
    modalRef.componentInstance.modalHeaderText = 'Editing Leadership Role';
    modalRef.componentInstance.modalAction = ModalActionEnums.Edit;
    modalRef.result.then((result: LeadershipRole) => {
      if (result) {
        this.updateLeadershipRoleInList(result);
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Leadership Role Modal.');
        console.log(error);
      }
    });
  }

  private updateLeadershipRoleInList(leadershipRole: LeadershipRole) {
    let index = this.leadershipRoles?.findIndex(x => x.leadershipRoleId == leadershipRole.leadershipRoleId)

    if (this.leadershipRoles && index !== undefined && index >= 0) {
      this.leadershipRoles[index] = leadershipRole;
    }
  }
}
