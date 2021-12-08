import * as i from 'types';
import { produce } from 'immer';


const immer = (config: i.StateCreatorImmer): i.StateCreator => (set, get, api) => {
  return config((fn) => set(produce(fn)), get, api);
};

export default immer;
