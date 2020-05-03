import { async, TestBed } from '@angular/core/testing';
import { AbcLayoutModule } from './abc-layout.module';

describe('AbcLayoutModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AbcLayoutModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AbcLayoutModule).toBeDefined();
  });
});
