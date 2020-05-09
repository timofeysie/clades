import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as fromItems from './items.reducer';
import * as ItemsActions from './items.actions';

@Injectable()
export class ItemsEffects {
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return ItemsActions.loadItemsSuccess({ items: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return ItemsActions.loadItemsFailure({ error });
        }
      })
    )
  );

  constructor(private actions$: Actions) {}
}
