import * as i from 'types';
import { StateCreator } from 'zustand';
import { Draft, produce } from 'immer';

type S = i.AppState;
type SC = StateCreator<S>;
type SCFN = StateCreator<S, (fn: (draft: Draft<S>) => void) => void>;

const immer = (config: SCFN): SC => (set, get, api) =>
  config((fn) => set(produce<S>(fn)), get, api);

export default immer;
