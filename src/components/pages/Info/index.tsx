import * as i from 'types';
import React from 'react';
import { useQuery } from 'react-query';
import Showdown from 'showdown';

import useStore from 'state';
import { SmoothScroll } from 'services';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

import MediaTitle from 'common/typography/MediaTitle';

import { InfoContainer, InfoDescription, InfoFigure } from './styled';


let scroller: SmoothScroll | undefined;

const Info: React.VFC = () => {
  const state = useStore();
  const [visible, setVisible] = React.useState(false);
  const descriptionRef = React.useRef<HTMLDivElement>(null);
  const loader = React.useContext(AssetsLoaderContext);
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

        loader
          ?.addImageAsset((img) => {
            img.src = CMS_URL + newData.image.url;
          })
          .then(loader?.pageLoader.addLoaded);

        return newData;
      }),
  );

  React.useEffect(() => {
    return function cleanup() {
      loader?.pageLoader.reset();
    };
  }, []);

  React.useEffect(() => {
    if (loader?.pageLoader.loaded === 1) {
      state.ui.setLoading(false);

      setTimeout(() => {
        setVisible(true);
      }, 500);
    }
  }, [loader?.pageLoader.loaded]);

  React.useEffect(() => {
    if (!data && !state.ui.loading) {
      state.ui.setLoading('page');
    }

    if (data && !state.ui.loading) {
      scroller = new SmoothScroll('#info-container');
    }

    return function cleanup() {
      scroller?.destroy();
    };
  }, [data, state.ui.loading]);

  if (!data || state.ui.loading) {
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
