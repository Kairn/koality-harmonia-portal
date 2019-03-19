import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageMomentComponent } from './admin-manage-moment.component';

describe('AdminManageMomentComponent', () => {
  let component: AdminManageMomentComponent;
  let fixture: ComponentFixture<AdminManageMomentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageMomentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
