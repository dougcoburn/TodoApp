import { shallowEqual } from 'fast-equals';

const generation = Symbol('gc__generation');
const OBJECT_TYPEOF = typeof ({});
// const SYMBOL_TYPEOF = typeof generation;
// const NUMBER_TYPEOF = typeof 1;
// const BOOLEAN_TYPEOF = typeof true;
// const UNDEFINED_TYPEOF = typeof undefined;
// const STRING_TYPEOF = typeof '';
// const FUNCTION_TYPEOF = typeof function () { };

export function denormalize(frozenStore) {
  return frozenStore === undefined ? undefined : JSON.parse(JSON.stringify(frozenStore));
}

/**
 *
 * @param {{}} store
 * @param {Map} gc
 */
export function normalize(store, gc) {
  const thisGeneration = (gc.get(generation) || 1) + 1;
  gc.delete(generation);
  const existingObjects = [...gc.keys()];
  const json = JSON.stringify(store);
  const output = JSON.parse(json, (key, value) => {
    if (value === null) {
      return value;
    }
    const valType = typeof value;
    if (valType === OBJECT_TYPEOF) {
      const existingObjectsLength = existingObjects.length;
      let dup;
      for (let i = 0; i < existingObjectsLength; i++) {
        dup = existingObjects[i];
        if (shallowEqual(dup, value)) {
          break;
        }
        dup = undefined;
      }
      if (dup !== undefined) {
        gc.set(dup, thisGeneration);
        return dup;
      }
      const frozen = Object.freeze(value);
      existingObjects.push(frozen);
      gc.set(frozen, thisGeneration);
      return frozen;
    }
    return value;
  });
  const entries = [...gc.entries()];
  const numEntries = entries.length;
  gc.set(generation, thisGeneration);
  for (let i = 0; i < numEntries; i++) {
    const [key, value] = entries[i];
    if (thisGeneration - value > 5) {
      gc.delete(key);
    }
  }
  return output;
}

const gcMem = new Map();

// an enhancer takes a StoreCreator and returns a StoreCreator https://redux.js.org/glossary#store-enhancer
const pureEnhancer = createStore => (reducer, initialState, enhancer) => {
  let lastState = null;
  const pureReducer = (state, action) => {
    lastState = null;
    return reducer(denormalize(state), action);
  };
  const store = createStore(pureReducer, denormalize(initialState), enhancer);
  const parentGetState = store.getState;
  return {
    ...store,
    getState() {
      if (!lastState) {
        console.log('normalize');
        lastState = normalize(parentGetState.apply(store), gcMem);
      }
      return lastState;
    }
  };
};
export default pureEnhancer;
