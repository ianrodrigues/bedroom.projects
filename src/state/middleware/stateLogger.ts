import * as i from 'types';
import { StateCreator } from 'zustand';

type S = StateCreator<i.AppState>;

// Log every time state is changed
const log = (config: S): S => (set, get, api) =>
  config((args) => {
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

export default log;
