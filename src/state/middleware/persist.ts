import * as i from 'types';
import { persist, PersistOptions } from 'zustand/middleware';

const persistOptions: PersistOptions<i.AppState> = {
  name: PROJECT_NAME,
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const persistedState = (config: i.StateCreator) => persist(config, persistOptions);

export default persistedState;
