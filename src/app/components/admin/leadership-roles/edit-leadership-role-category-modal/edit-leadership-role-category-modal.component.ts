import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalActionEnums } from 'src/app/enums/modalActionEnums';
import { LeadershipRoleCategory } from 'src/app/models/leadershipRoleCategory';
import { LeadershipRoleCategoriesService } from 'src/app/services/leadershipRoleCategories.service';


@Component({
  selector: 'kofc-edit-leadership-role-category-modal',
  templateUrl: './edit-leadership-role-category-modal.component.html',
  styleUrls: ['./edit-leadership-role-category-modal.component.css']
})
export class EditLeadershipRoleCategoryModalComponent implements OnInit, OnDestroy {
  @Input() modalHeaderText: string = '';
  @Input() modalAction: ModalActionEnums = ModalActionEnums.Create;
  @Input() leadershipRoleCategory?: LeadershipRoleCategory;
  updateLeadershipRoleCategorySubscription?: Subscription;
  createLeadershipRoleCategorySubscription?: Subscription;
  editLeadershipRoleCategoryForm: FormGroup;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private leadershipRoleCategoriesService: LeadershipRoleCategoriesService) {
    this.editLeadershipRoleCategoryForm = this.fb.group({
      leadershipRoleCategoryId: [''],
      categoryName: ['']
     });
  }

  ngOnInit() {
    if (this.leadershipRoleCategory) {
      this.editLeadershipRoleCategoryForm.patchValue({
        leadershipRoleCategoryId: this.leadershipRoleCategory.leadershipRoleCategoryId,
        categoryName: this.leadershipRoleCategory.categoryName
       });
    }
  }

  ngOnDestroy() {
    if (this.updateLeadershipRoleCategorySubscription) {
      this.updateLeadershipRoleCategorySubscription.unsubscribe();
    }

    if (this.createLeadershipRoleCategorySubscription) {
      this.createLeadershipRoleCategorySubscription.unsubscribe();
    }
  }

  onSubmitEditLeadershipRoleCategory() {
    if (this.modalAction === ModalActionEnums.Edit) {
      let updatedLeadershipRoleCategory = new LeadershipRoleCategory(this.editLeadershipRoleCategoryForm.getRawValue());

      this.updateLeadershipRoleCategory(updatedLeadershipRoleCategory);
    } else if (this.modalAction === ModalActionEnums.Create) {
      let newLeadershipRoleCategory = new LeadershipRoleCategory(this.editLeadershipRoleCategoryForm.getRawValue());
      this.createLeadershipRoleCategory(newLeadershipRoleCategory);
    }
  }

  private updateLeadershipRoleCategory(leadershipRoleCategory: LeadershipRoleCategory) {
    let leadershipRoleCategoryObserver = {
      next: (leadershipRoleCategory: LeadershipRoleCategory) => this.passBack(leadershipRoleCategory),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Role Category updated.')
    };

    this.updateLeadershipRoleCategorySubscription = this.leadershipRoleCategoriesService.updateLeadershipRoleCategory(leadershipRoleCategory).subscribe(leadershipRoleCategoryObserver);
  }

  private createLeadershipRoleCategory(leadershipRoleCategory: LeadershipRoleCategory) {
    let leadershipRoleCategoryObserver = {
      next: (createdLeadershipRoleCategory: LeadershipRoleCategory) => this.passBack(createdLeadershipRoleCategory),
      error: (err: any) => console.log(`${err}`),
      complete: () => console.log('Leadership Role Category created.')
    };

    this.createLeadershipRoleCategorySubscription = this.leadershipRoleCategoriesService.createLeadershipRoleCategory(leadershipRoleCategory).subscribe(leadershipRoleCategoryObserver);
  }

  passBack(leadershipRoleCategory: LeadershipRoleCategory) {
    this.activeModal.close(leadershipRoleCategory);
  }
}
