import { TestBed } from '@angular/core/testing';

import { IpApiService } from './ip-api.service';

describe('WeatherApiService', () => {
  let service: IpApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
