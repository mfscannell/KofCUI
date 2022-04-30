/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditKnightPasswordModalComponent } from './edit-knight-password-modal.component';

describe('EditKnightPasswordComponentComponent', () => {
  let component: EditKnightPasswordModalComponent;
  let fixture: ComponentFixture<EditKnightPasswordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditKnightPasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnightPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
