/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditKnightMemberInfoModalComponent } from './edit-knight-member-info-modal.component';

describe('EditKnightMemberInfoModalComponent', () => {
  let component: EditKnightMemberInfoModalComponent;
  let fixture: ComponentFixture<EditKnightMemberInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKnightMemberInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnightMemberInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
