import * as i from 'types';
import { MakeGenerics } from 'react-location';


export interface DetailPageGenerics extends MakeGenerics<{
  Params: {
    slug: string;
  };
  Search: {
    next?: number;
  };
}> {}

export interface InfoPageGenerics extends MakeGenerics<{
  LoaderData: {
    page: i.APIInfoObject;
  }
}> {}
