import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagePanelComponent } from './admin-manage-panel.component';

describe('AdminManagePanelComponent', () => {
  let component: AdminManagePanelComponent;
  let fixture: ComponentFixture<AdminManagePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManagePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
