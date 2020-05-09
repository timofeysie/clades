import { ItemsEntity } from './items.models';
import * as ItemsActions from './items.actions';
import { State, initialState, reducer } from './items.reducer';

describe('Items Reducer', () => {
  const createItemsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ItemsEntity);

  beforeEach(() => {});

  describe('valid Items actions', () => {
    it('loadItemsSuccess should return set the list of known Items', () => {
      const items = [
        createItemsEntity('PRODUCT-AAA'),
        createItemsEntity('PRODUCT-zzz')
      ];
      const action = ItemsActions.loadItemsSuccess({ items });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
