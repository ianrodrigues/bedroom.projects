import * as i from 'types';
import * as React from 'react';
import shallow from 'zustand/shallow';

import useStore from 'state';


export function useShallowStore<
  K extends keyof i.AppState,
  SK extends SliceKeys<K>,
  R extends Data<K, SK>,
>(key: K, sliceKeys: SKP<SK, K, R>): R {
  const selector = React.useCallback((state: i.AppState) => {
    const data: Partial<i.AppState[K]> = {};

    // Append slice values to data
    if (Array.isArray(sliceKeys)) {
      for (const sliceKey of sliceKeys) {
        data[sliceKey] = state[key][sliceKey];
      }

      return data as R;
    }

    // Return cb with state slice
    return sliceKeys(state[key]);
  }, []);

  return useStore(selector, shallow);
}

// type StateKeys = keyof i.AppState;

// Get all keys from state slice K
type SliceKeys<K extends keyof i.AppState> = (keyof i.AppState[K])[];

type SKP<SK, K extends keyof i.AppState, R> = SK | ((state: i.AppState[K]) => R)

// Get key/value pairs for keys SliceKeys SK of slice K
type Data<K extends keyof i.AppState, SK extends SliceKeys<K>> = {
  [P in SK[number]]: i.AppState[K][P];
};
