/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditLeadershipRoleCategoryModalComponent } from './edit-leadership-role-category-modal.component';

describe('EditLeadershipRoleCategoryModalComponent', () => {
  let component: EditLeadershipRoleCategoryModalComponent;
  let fixture: ComponentFixture<EditLeadershipRoleCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLeadershipRoleCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeadershipRoleCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
