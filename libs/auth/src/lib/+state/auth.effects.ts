import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthActionTypes } from './auth.actions';
import * as fromAuth from './auth.reducer';
import * as AuthActions from './auth.actions';
import { User } from '@clades/data-models';
import { AuthService } from './../services/auth/auth.service';
import { login, loginSuccess, loginFailure } from './auth.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    fetch({
      run: action => {
        this.authService
        .login(action)
      },
      onError: (action, error) => {
        console.error('Error', error);
        return AuthActions.loginFailure(error);
      }
    })
  );

  @Effect({ dispatch: false })
  navigateToProfile $ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginSuccess),
    map((action: loginSuccess) => action.payload),
    tap(() => this.router.navigate([`/products`]))
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
