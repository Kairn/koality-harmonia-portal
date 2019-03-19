import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeManageAlbumComponent } from './koalibee-manage-album.component';

describe('KoalibeeManageAlbumComponent', () => {
  let component: KoalibeeManageAlbumComponent;
  let fixture: ComponentFixture<KoalibeeManageAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeManageAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeManageAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
