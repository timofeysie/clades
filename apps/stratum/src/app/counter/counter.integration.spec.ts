import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { CounterComponent } from './counter.component';
import { counterReducer } from '../store/counter.reducer';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterComponent ],
      imports: [
        StoreModule.forRoot({ count: counterReducer })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should increment the counter value when increment is clicked', () => {
    clickByCSS('#increment');
    expect(getCounterText()).toBe(
      'Current Count: 1'
    );
  });

  it('should decrement the counter value when decrement is clicked', () => {
    clickByCSS('#decrement');
    expect(getCounterText()).toBe(
      'Current Count: -1'
    );
  });

  it('should reset the counter value when reset is clicked', () => {
    clickByCSS('#increment');
    clickByCSS('#reset');
    expect(getCounterText()).toBe(
      'Current Count: 0'
    );
  });

  function clickByCSS(selector: string) {
    const debugElement = fixture.debugElement.query(By.css(selector));
    const el: HTMLElement = debugElement.nativeElement;
    el.click();
    fixture.detectChanges();
  }

  function getCounterText() {
    const compiled = fixture.debugElement.nativeElement;
    return compiled.querySelector('div').textContent;
  }
});