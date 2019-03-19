import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeProfileComponent } from './koalibee-profile.component';

describe('KoalibeeProfileComponent', () => {
  let component: KoalibeeProfileComponent;
  let fixture: ComponentFixture<KoalibeeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
