import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeEditAlbumComponent } from './koalibee-edit-album.component';

describe('KoalibeeEditAlbumComponent', () => {
  let component: KoalibeeEditAlbumComponent;
  let fixture: ComponentFixture<KoalibeeEditAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeEditAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeEditAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
