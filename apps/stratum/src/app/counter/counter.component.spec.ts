import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { createAction } from '@ngrx/store';
import { counterReducer, initialState } from '../store/counter.reducer';
import { increment, decrement, reset } from '../store/counter.actions';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  let store: MockStore;

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

  it('should return a default state using nonexistent action', () => {
    const noopAction = createAction('noop');
    const newState = counterReducer(0, noopAction);
    expect(newState).toEqual(initialState);
  });

  it('increment reducer should increment the state', () => {
    const incrementedState = counterReducer(0, increment);
    expect(incrementedState).toBe(1);
  });

  it('decrement reducer should decrement the state', () => {
    const decrementedState = counterReducer(0, decrement);
    expect(decrementedState).toBe(-1);
  });

  it('reset reducer should reset the state', () => {
    const resetState = counterReducer(2, reset);
    expect(resetState).toBe(0);
  });
  
});
