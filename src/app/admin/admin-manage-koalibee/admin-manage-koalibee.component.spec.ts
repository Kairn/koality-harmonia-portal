import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageKoalibeeComponent } from './admin-manage-koalibee.component';

describe('AdminManageKoalibeeComponent', () => {
  let component: AdminManageKoalibeeComponent;
  let fixture: ComponentFixture<AdminManageKoalibeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageKoalibeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageKoalibeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
