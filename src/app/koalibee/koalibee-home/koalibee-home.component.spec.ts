import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeHomeComponent } from './koalibee-home.component';

describe('KoalibeeHomeComponent', () => {
  let component: KoalibeeHomeComponent;
  let fixture: ComponentFixture<KoalibeeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
