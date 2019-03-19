import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageReviewComponent } from './admin-manage-review.component';

describe('AdminManageReviewComponent', () => {
  let component: AdminManageReviewComponent;
  let fixture: ComponentFixture<AdminManageReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
