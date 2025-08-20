import { TestBed } from '@angular/core/testing';

import { PumpScenarioService } from './pump-scenario.service';

describe('PumpScenarioService', () => {
  let service: PumpScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PumpScenarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
