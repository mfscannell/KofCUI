/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KnightsComponent } from './knights.component';

describe('KnightsComponent', () => {
  let component: KnightsComponent;
  let fixture: ComponentFixture<KnightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
