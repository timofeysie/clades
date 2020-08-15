import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '@clades/auth';
import * as AuthActions from '@clades/auth';

@Component({
  selector: 'clades-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stromatolites';

  constructor(private store: Store<AuthState>) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.store.dispatch(AuthActions.loginSuccess(user));
    }
  }
}
