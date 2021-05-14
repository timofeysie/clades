import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      map(() => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return ProductsActions.loadProductsSuccess({ products: [] });
        }),
      catchError((action, error) => of(ProductsActions.loadProductsFailure({ error })))
    )}
  );

  constructor(private actions$: Actions) {}
}
