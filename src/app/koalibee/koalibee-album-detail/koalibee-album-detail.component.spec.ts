import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeAlbumDetailComponent } from './koalibee-album-detail.component';

describe('KoalibeeAlbumDetailComponent', () => {
  let component: KoalibeeAlbumDetailComponent;
  let fixture: ComponentFixture<KoalibeeAlbumDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeAlbumDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeAlbumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
