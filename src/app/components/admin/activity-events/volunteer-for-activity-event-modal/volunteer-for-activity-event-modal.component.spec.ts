/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VolunteerForActivityEventModalComponent } from './volunteer-for-activity-event-modal.component';

describe('VolunteerForActivityEventModalComponent', () => {
  let component: VolunteerForActivityEventModalComponent;
  let fixture: ComponentFixture<VolunteerForActivityEventModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolunteerForActivityEventModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerForActivityEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
