import type { MakeGenerics } from 'react-location';


export type Side = 'L' | 'R';
export type SizeData = Record<Side, null | 'large' | 'full'>;
export type MediaType = 'photo' | 'video';

export interface DetailPageGenerics extends MakeGenerics<{
  Params: {
    slug: string;
  };
  Search: {
    next?: number;
  };
}> {}
