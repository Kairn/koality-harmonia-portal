import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageAlbumComponent } from './admin-manage-album.component';

describe('AdminManageAlbumComponent', () => {
  let component: AdminManageAlbumComponent;
  let fixture: ComponentFixture<AdminManageAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
