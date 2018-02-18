import { TestBed, inject } from '@angular/core/testing';

import { TransactionsServices } from './transactions.service';

describe('TransactionsServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionsServices]
    });
  });

  it('should be created', inject([TransactionsServices], (service: TransactionsServices) => {
    expect(service).toBeTruthy();
  }));
});
