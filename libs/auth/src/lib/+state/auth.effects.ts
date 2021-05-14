import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { AuthActionTypes } from './auth.actions';
import * as AuthActions from './auth.actions';
import { User } from '@clades/data-models';
import { AuthService } from './../services/auth/auth.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActionTypes.Login),
      switchMap(({ payload }) =>
        this.authService.login(payload).pipe(
          map((user: User) => AuthActions.loginSuccess({ payload: user })),
          catchError((error) => of(AuthActions.loginFailure(error)))
        )
      )
    );
  });

  navigateToProfile$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(AuthActionTypes.LoginSuccess),
        map((action: AuthActionTypes.LoginSuccess) => {
          return action;
        }),
        tap(() => {
          this.router.navigate([`/products`]);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService
  ) {}
}
