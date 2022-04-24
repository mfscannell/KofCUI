import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { EditLeadershipRoleModalComponent } from 'src/app/components/admin/leadership-roles/edit-leadership-role-modal/edit-leadership-role-modal.component';
import { Knight } from 'src/app/models/knight';
import { LeadershipRole } from 'src/app/models/leadershipRole';
import { LeadershipRoleCategory } from 'src/app/models/leadershipRoleCategory';
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
  leadershipRoleCategories: LeadershipRoleCategory[] = [];
  knightsLoaded: boolean = false;
  knightsSubscription?: Subscription;
  leadershipRolesSubscription?: Subscription;
  closeModalResult = '';

  constructor(private knightsService: KnightsService,
    private leadershipRolesService: LeadershipRolesService,
    private modalService: NgbModal) {

    }

  ngOnInit() {
    this.getAllKnights();
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

  private getAllKnights() {
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
      next: (leadershipRoleCategories: LeadershipRoleCategory[]) => this.leadershipRoleCategories = leadershipRoleCategories,
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Roles loaded.')
    };
    this.leadershipRolesSubscription = this.leadershipRolesService.getAllLeadershipRoles().subscribe(leadershipRolesObserver);
  }

  openCreateLeadershipRoleModal() {
    const modalRef = this.modalService.open(EditLeadershipRoleModalComponent, {size: 'lg', ariaLabelledBy: 'modal-basic-title'});
    
    modalRef.componentInstance.allKnights = this.allKnights;
    modalRef.componentInstance.leadershipRole = new LeadershipRole({
      occupied: false,
      leadershipRoleCategory: LeadershipRoleCategoryEnums.Director
    });
    modalRef.componentInstance.modalHeaderText = 'Creating Leadership Role';
    modalRef.componentInstance.modalAction = ModalActionEnums.Create;
    modalRef.result.then((result: LeadershipRole) => {
      if (result) {
        this.leadershipRoleCategories.forEach((category) => {
          if (category.categoryName === LeadershipRoleCategoryEnums.Director) {
            category.leadershipRoles.push(result);
          }
        });
      }
    }).catch((error) => {
      if (error !== 0) {
        console.log('Error from Edit Leadership Role Modal.');
        console.log(error);
      }
    });
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
    this.leadershipRoleCategories.forEach((category) => {
      var ind = category.leadershipRoles.findIndex(lr => lr.leadershipRoleId === leadershipRole.leadershipRoleId);

      if (ind > -1) {
        category.leadershipRoles[ind] = leadershipRole;
      }
    });
  }
}
