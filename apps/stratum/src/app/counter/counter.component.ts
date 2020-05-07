import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { increment, decrement, reset } from '../store/counter.actions';
import { AppState } from '../store/appState';  

@Component({
  selector: 'clades-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {
  count$: Observable<number>;

  constructor(private store: Store<{ count: number }>) {
    this.count$ = store.pipe(select('count'));
  }

  ngOnInit(): void {}

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }
}
