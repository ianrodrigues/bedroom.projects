import * as i from 'types';
import { GetState, SetState, StateCreator, StoreApi } from 'zustand';

// Log every time state is changed
export const log = (config: StateCreator<i.AppState>) => (
  set: SetState<i.AppState>,
  get: GetState<i.AppState>,
  api: StoreApi<i.AppState>,
): i.AppState => config((args) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('  applying', args);
  }

  set(args);

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('  new state', get());
  }
}, get, api);
