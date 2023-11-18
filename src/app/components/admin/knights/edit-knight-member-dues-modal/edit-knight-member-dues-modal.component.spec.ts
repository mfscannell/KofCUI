/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditKnightMemberDuesModalComponent } from './edit-knight-member-dues-modal.component';

describe('EditKnightMemberDuesModalComponent', () => {
  let component: EditKnightMemberDuesModalComponent;
  let fixture: ComponentFixture<EditKnightMemberDuesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKnightMemberDuesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnightMemberDuesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
