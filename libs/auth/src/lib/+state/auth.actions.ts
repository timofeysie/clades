import { createAction, props } from '@ngrx/store';
import { AuthEntity } from './auth.models';

export const loadAuth = createAction('[Auth] Load Auth');

export const loadAuthSuccess = createAction(
  '[Auth] Load Auth Success',
  props<{ auth: AuthEntity[] }>()
);

export const loadAuthFailure = createAction(
  '[Auth] Load Auth Failure',
  props<{ error: any }>()
);
