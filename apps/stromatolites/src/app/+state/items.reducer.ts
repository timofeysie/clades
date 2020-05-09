import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ItemsActions from './items.actions';
import { ItemsEntity } from './items.models';

export const ITEMS_FEATURE_KEY = 'items';

export interface State extends EntityState<ItemsEntity> {
  selectedId?: string | number; // which Items record has been selected
  loaded: boolean; // has the Items list been loaded
  error?: string | null; // last none error (if any)
}

export interface ItemsPartialState {
  readonly [ITEMS_FEATURE_KEY]: State;
}

export const itemsAdapter: EntityAdapter<ItemsEntity> = createEntityAdapter<
  ItemsEntity
>();

export const initialState: State = itemsAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const itemsReducer = createReducer(
  initialState,
  on(ItemsActions.loadItems, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ItemsActions.loadItemsSuccess, (state, { items }) =>
    itemsAdapter.addAll(items, { ...state, loaded: true })
  ),
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
  return itemsReducer(state, action);
}
