import { createAction, props } from '@ngrx/store';
import { ItemsEntity } from './items.models';

export const loadItems = createAction('[Items] Load Items');

export const loadItemsSuccess = createAction(
  '[Items] Load Items Success',
  props<{ items: ItemsEntity[] }>()
);

export const loadItemsFailure = createAction(
  '[Items] Load Items Failure',
  props<{ error: any }>()
);
