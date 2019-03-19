import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeDashboardComponent } from './koalibee-dashboard.component';

describe('KoalibeeDashboardComponent', () => {
  let component: KoalibeeDashboardComponent;
  let fixture: ComponentFixture<KoalibeeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
