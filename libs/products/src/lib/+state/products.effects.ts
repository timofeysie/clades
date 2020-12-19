import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as fromProducts from './products.reducer';
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return ProductsActions.loadProductsSuccess({ products: [] });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return ProductsActions.loadProductsFailure({ error });
        }
      })
    )
  );

  constructor(private actions$: Actions) {}
}
