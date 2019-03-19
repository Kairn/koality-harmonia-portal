import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageTrackComponent } from './admin-manage-track.component';

describe('AdminManageTrackComponent', () => {
  let component: AdminManageTrackComponent;
  let fixture: ComponentFixture<AdminManageTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
