import { ItemsEntity } from './items.models';
import { State, itemsAdapter, initialState } from './items.reducer';
import * as ItemsSelectors from './items.selectors';

describe('Items Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getItemsId = it => it['id'];
  const createItemsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as ItemsEntity);

  let state;

  beforeEach(() => {
    state = {
      items: itemsAdapter.addAll(
        [
          createItemsEntity('PRODUCT-AAA'),
          createItemsEntity('PRODUCT-BBB'),
          createItemsEntity('PRODUCT-CCC')
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('Items Selectors', () => {
    it('getAllItems() should return the list of Items', () => {
      const results = ItemsSelectors.getAllItems(state);
      const selId = getItemsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ItemsSelectors.getSelected(state);
      const selId = getItemsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getItemsLoaded() should return the current 'loaded' status", () => {
      const result = ItemsSelectors.getItemsLoaded(state);

      expect(result).toBe(true);
    });

    it("getItemsError() should return the current 'error' state", () => {
      const result = ItemsSelectors.getItemsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
