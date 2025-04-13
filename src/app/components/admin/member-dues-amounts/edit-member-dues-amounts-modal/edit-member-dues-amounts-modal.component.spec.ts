/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditMemberDuesAmountsModalComponent } from './edit-member-dues-amounts-modal.component';

describe('EditMemberDuesAmountsModalComponent', () => {
  let component: EditMemberDuesAmountsModalComponent;
  let fixture: ComponentFixture<EditMemberDuesAmountsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMemberDuesAmountsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMemberDuesAmountsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
