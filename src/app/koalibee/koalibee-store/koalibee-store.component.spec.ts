import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeStoreComponent } from './koalibee-store.component';

describe('KoalibeeStoreComponent', () => {
  let component: KoalibeeStoreComponent;
  let fixture: ComponentFixture<KoalibeeStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
