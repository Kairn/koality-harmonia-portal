import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeePlayerComponent } from './koalibee-player.component';

describe('KoalibeePlayerComponent', () => {
  let component: KoalibeePlayerComponent;
  let fixture: ComponentFixture<KoalibeePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
