/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditKnightPersonalInfoModalComponent } from './edit-knight-personal-info-modal.component';

describe('EditKnightPersonalInfoModalComponent', () => {
  let component: EditKnightPersonalInfoModalComponent;
  let fixture: ComponentFixture<EditKnightPersonalInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKnightPersonalInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnightPersonalInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
