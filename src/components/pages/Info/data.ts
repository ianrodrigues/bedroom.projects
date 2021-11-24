import * as i from 'types';
import Showdown from 'showdown';
import { LoaderFn } from 'react-location';

import useStore from 'state';


const loader: LoaderFn = async (props, loader) => {
  const { ui } = useStore.getState();

  // Info page will set loading to false after asset load
  ui.setLoading('page');

  const res = await fetch(CMS_URL + '/bedroom-infos/1');

  loader.dispatch({
    type: 'maxAge',
    maxAge: Number(res.headers.get('max-age')) ?? 5 * (60 * 1000), // 5 minutes
  });

  const data: i.APIInfoObject = await res.json();

  const converter = new Showdown.Converter();
  const html = converter.makeHtml(data.description);
  const pageData: i.APIInfoObject = {
    ...data,
    description: html,
  };

  return {
    page: pageData,
  };
};

export default loader;
