import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let store: MockStore;
  const initialState = { count: 0 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [ CounterComponent ],
      providers: [Store, provideMockStore({ initialState })]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('counter should start at 0',  done => {
    component.count$.subscribe( count => {
      expect(count).toEqual(0);
      done();
    });
    
  });

});
