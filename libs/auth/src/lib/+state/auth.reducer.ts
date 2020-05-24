import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as AuthActions from './auth.actions';
import { AuthEntity } from './auth.models';
import { Authenticate, User } from '@clades/data-models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthData {
  loading: boolean;
  user: User;
  error: Error
}

export interface AuthState {
  readonly auth: AuthData;
}

export interface State extends EntityState<AuthEntity> {
  selectedId?: string | number; // which Auth record has been selected
  loaded: boolean; // has the Auth list been loaded
  error?: string | null; // last none error (if any)
}
export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: State;
}

export const authAdapter: EntityAdapter<AuthEntity> = createEntityAdapter<
  AuthEntity
>();
export const initialState: State = authAdapter.getInitialState({
  // set initial required properties
  action: AuthActions,
  loaded: false
});
const authReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, state => ( {...state, user: AuthActions.loginSuccess, loading: false })),
  on(AuthActions.loginFailure, state => ({ ...state, user: null, loading: false }))
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
