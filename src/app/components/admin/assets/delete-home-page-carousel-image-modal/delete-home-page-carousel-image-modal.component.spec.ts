/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeleteHomePageCarouselImageModalComponent } from './delete-home-page-carousel-image-modal.component';

describe('DeleteHomePageCarouselImageModalComponent', () => {
  let component: DeleteHomePageCarouselImageModalComponent;
  let fixture: ComponentFixture<DeleteHomePageCarouselImageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteHomePageCarouselImageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteHomePageCarouselImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
