import * as i from 'types';
import React from 'react';
import { useMatch } from 'react-location';

import { SmoothScroll } from 'services';
import { usePageAssetLoadCounter, useShallowStore } from 'hooks';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

import MediaTitle from 'common/typography/MediaTitle';

import { InfoContainer, InfoDescription, InfoFigure } from './styled';


let scroller: SmoothScroll | undefined;

const Info: React.VFC = () => {
  const ui = useShallowStore('ui', ['loading', 'setLoading']);
  const { page } = useMatch<i.InfoPageGenerics>().data;
  const [visible, setVisible] = React.useState(false);
  const descriptionRef = React.useRef<HTMLDivElement>(null);
  const loader = React.useContext(AssetsLoaderContext);
  const assetLoadCounter = usePageAssetLoadCounter();

  React.useEffect(() => {
    return function cleanup() {
      assetLoadCounter.reset();
      scroller?.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (assetLoadCounter.loaded === 1) {
      ui.setLoading(false);

      setTimeout(() => {
        setVisible(true);
      }, 500);
    }
  }, [assetLoadCounter.loaded]);

  React.useEffect(() => {
    if (page) {
      loader
        ?.addImageAsset((img) => {
          img.src = CMS_URL + page.image.url;
        })
        .then(assetLoadCounter.addLoaded);

      if (!ui.loading) {
        scroller = new SmoothScroll('#info-container');
      }
    }
  }, [page, ui.loading]);

  if (!page || ui.loading) {
    return null;
  }

  return (
    <InfoContainer $visible={visible}>
      <div id="info-container">
        <InfoDescription
          id="info-container__body"
          ref={descriptionRef}
          dangerouslySetInnerHTML={{ __html: page.description }}
        />
      </div>
      <div id="info-container--hitbox" />

      <InfoFigure>
        <img src={CMS_URL + page.image.url} alt={page.image.alternativeText} />
      </InfoFigure>

      <MediaTitle side="R" visible>{page.title}</MediaTitle>
    </InfoContainer>
  );
};

export default Info;
