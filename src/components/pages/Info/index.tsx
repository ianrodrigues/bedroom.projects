import * as i from 'types';
import React from 'react';
import { useQuery } from 'react-query';
import Showdown from 'showdown';

import useStore from 'state';
import { SmoothScroll } from 'services';

import MediaTitle from 'common/typography/MediaTitle';

import { InfoContainer, InfoDescription, InfoFigure } from './styled';


let scroller: SmoothScroll | undefined;
let loaded = 0;
const LOADED_AMT = 1;

const Info: React.VFC = () => {
  const state = useStore();
  const [visible, setVisible] = React.useState(false);
  const descriptionRef = React.useRef<HTMLDivElement>(null);
  const { data } = useQuery<i.APIInfoObject, Error>('info', () =>
    fetch(CMS_URL + '/bedroom-infos/1')
      .then((res) => res.json())
      .then((data: i.APIInfoObject) => {
        const converter = new Showdown.Converter();
        const html = converter.makeHtml(data.description);
        const newData: i.APIInfoObject = {
          ...data,
          description: html,
        };

        const img = document.createElement('img');
        img.onload = handleLoaded;
        img.src = CMS_URL + newData.image.url;

        return newData;
      }),
  );

  React.useEffect(() => {
    if (!data && !state.loading) {
      state.setLoading('page');
    }

    if (data && !state.loading) {
      scroller = new SmoothScroll('#info-container');
    }

    return function cleanup() {
      scroller?.destroy();
    };
  }, [data, state.loading]);

  function handleLoaded() {
    loaded++;

    if (loaded >= LOADED_AMT) {
      state.setLoading(false);

      setTimeout(() => {
        setVisible(true);
      }, 500);
    }
  }

  if (!data || state.loading) {
    return null;
  }

  return (
    <InfoContainer $visible={visible}>
      <div id="info-container">
        <InfoDescription id="info-container__body" ref={descriptionRef} dangerouslySetInnerHTML={{ __html: data.description }} />
      </div>
      <div id="info-container--hitbox" />

      <InfoFigure>
        <img src={CMS_URL + data.image.url} alt={data.image.alternativeText} />
      </InfoFigure>

      <MediaTitle side="R" visible>{data.title}</MediaTitle>
    </InfoContainer>
  );
};

export default Info;
