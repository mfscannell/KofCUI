/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UploadHomePageCarouselImageModalComponent } from './upload-home-page-carousel-image-modal.component';

describe('UploadHomePageCarouselImageModalComponent', () => {
  let component: UploadHomePageCarouselImageModalComponent;
  let fixture: ComponentFixture<UploadHomePageCarouselImageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHomePageCarouselImageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHomePageCarouselImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
