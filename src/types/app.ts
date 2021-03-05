import * as i from 'types';
export type Side = 'L' | 'R';
export type SizeData = Record<Side, null | 'large' | 'full'>;
export type MediaType = 'photo' | 'video';

export interface DetailPageParams {
  slug: string;
}

export interface CurNextDetails<T extends MediaType> {
  cur?: T extends 'photo' ? i.APIPhotosObject : i.APIMediaObject;
  next?: T extends 'photo' ? i.APIPhotosObject : i.APIMediaObject;
}
