import * as i from 'types';


// Log every time state is changed
const logger = (config: i.StateCreator): i.StateCreator => (set, get, api) =>
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

export default logger;
