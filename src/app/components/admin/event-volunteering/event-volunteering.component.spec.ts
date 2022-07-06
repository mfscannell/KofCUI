/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventVolunteeringComponent } from './event-volunteering.component';

describe('EventVolunteeringComponent', () => {
  let component: EventVolunteeringComponent;
  let fixture: ComponentFixture<EventVolunteeringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventVolunteeringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventVolunteeringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
