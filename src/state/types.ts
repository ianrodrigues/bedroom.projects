import * as i from 'types';
import { Draft } from 'immer';
import { GetState, StateCreator as ZustandStateCreator } from 'zustand';


export { AppState } from './index';

export type StateCreator = ZustandStateCreator<i.AppState>;

export type StateCreatorImmer = ZustandStateCreator<
i.AppState,
(fn: (draft: Draft<i.AppState>) => void) => void
>;

export type IntersectStoreSlice<Slice extends i.StoreSlice> =
  & Slice['state']
  & ReturnType<Slice['actions']>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreSlice<S extends i.AnyObject = any, A extends i.ActionsCreator = any> = {
  state: S;
  actions: A;
}

export type Set = ((fn: (state: i.AppState) => void) => void);
export type Get = GetState<i.AppState>;

export type ActionsCreator = (set: i.Set, get: i.Get) => Record<string, i.AnyFn>;

export type GlobalLoadingState = false | 'site' | 'page';

export interface AllMedia {
  photo: i.StatePhotoObject[];
  video: i.StateVideoObject[];
}
