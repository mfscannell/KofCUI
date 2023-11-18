/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditKnightActivityInterestsModalComponent } from './edit-knight-activity-interests-modal.component';

describe('EditKnightActivityInterestsModalComponent', () => {
  let component: EditKnightActivityInterestsModalComponent;
  let fixture: ComponentFixture<EditKnightActivityInterestsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKnightActivityInterestsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnightActivityInterestsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
