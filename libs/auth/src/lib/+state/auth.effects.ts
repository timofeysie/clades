import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';
import { AuthActionTypes } from './auth.actions';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    fetch({
      run: action => {
        return AuthActions.loginSuccess(action);
      },
      onError: (error) => {
        return AuthActions.loginFailure(error);
      }
    })
  );

  @Effect({ dispatch: false })
  navigateToProfile$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginSuccess),
    map((action: AuthActionTypes.LoginSuccess) => {
      return action;
    }),
    tap(() => {
      this.router.navigate([`/products`])
    })
  );

  constructor(
    private actions$: Actions,
    private router: Router
  ) {}
}
