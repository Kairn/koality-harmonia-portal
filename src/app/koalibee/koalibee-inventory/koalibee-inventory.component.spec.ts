import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoalibeeInventoryComponent } from './koalibee-inventory.component';

describe('KoalibeeInventoryComponent', () => {
  let component: KoalibeeInventoryComponent;
  let fixture: ComponentFixture<KoalibeeInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoalibeeInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoalibeeInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
