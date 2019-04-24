import { TestBed } from '@angular/core/testing';

import { KoalibeeService } from './koalibee.service';

describe('KoalibeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KoalibeeService = TestBed.get(KoalibeeService);
    expect(service).toBeTruthy();
  });
});
