import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ITEMS_FEATURE_KEY,
  State,
  ItemsPartialState,
  itemsAdapter
} from './items.reducer';

// Lookup the 'Items' feature state managed by NgRx
export const getItemsState = createFeatureSelector<ItemsPartialState, State>(
  ITEMS_FEATURE_KEY
);

const { selectAll, selectEntities } = itemsAdapter.getSelectors();

export const getItemsLoaded = createSelector(
  getItemsState,
  (state: State) => state.loaded
);

export const getItemsError = createSelector(
  getItemsState,
  (state: State) => state.error
);

export const getAllItems = createSelector(getItemsState, (state: State) =>
  selectAll(state)
);

export const getItemsEntities = createSelector(getItemsState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getItemsState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getItemsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
