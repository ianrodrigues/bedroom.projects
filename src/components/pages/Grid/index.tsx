import * as i from 'types';
import React from 'react';

import { usePageAssetLoadCounter, useShallowStore } from 'hooks';
import { SmoothScroll } from 'services';
import { isStatePhotoObject } from 'services/typeguards';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

import PreloadLink from 'common/navigation/PreloadLink';
import {
  Figure, FilterContainer, GridContainer, GridPageContainer, GridTile, Title, FilterButton,
} from './styled';


let scroller: SmoothScroll | undefined;

const Grid: React.VFC = () => {
  const ui = useShallowStore('ui', ['loading', 'setLoading']);
  const media = useShallowStore('media', ['allMedia']);
  const combinedMedia = React.useRef<(i.StatePhotoObject | i.StateVideoObject)[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [filtered, setFiltered] = React.useState<false | i.MediaType>(false);
  const [fadeIn, setFadeIn] = React.useState(false);
  const loader = React.useContext(AssetsLoaderContext);
  const assetLoadCounter = usePageAssetLoadCounter();

  React.useEffect(() => {
    scroller = new SmoothScroll('#grid-container');

    return function cleanup() {
      scroller?.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (combinedMedia.current.length === 0) {
      return;
    }

    // Set amount of assets to load
    assetLoadCounter.setAmount(combinedMedia.current.length);

    // Start load animation
    if (!assetLoadCounter.done) {
      ui.setLoading('page');
    } else {
      ui.setLoading(false);

      setTimeout(() => {
        setFadeIn(true);
      }, 750);
    }
  }, [combinedMedia.current, assetLoadCounter.done]);

  React.useEffect(() => {
    if (!media.allMedia) {
      return;
    }

    combinedMedia.current = [...media.allMedia.photo, ...media.allMedia.video];

    for (const media of combinedMedia.current) {
      loader
        ?.addImageAsset((img) => {
          if (isStatePhotoObject(media)) {
            img.src = CMS_URL + media.media_cover.formats!.small.url;
          } else {
            img.src = CMS_URL + media.video_poster.formats!.small.url;
          }
        })
        .then(assetLoadCounter.addLoaded);
    }
  }, [media.allMedia]);

  function toggleFilter(type: i.MediaType) {
    if (filtered === type) {
      setFiltered(false);
    } else {
      setFiltered(type);
    }
  }

  function renderGrid() {
    return combinedMedia.current && combinedMedia.current.map((media) => {
      const linkPrefix = isStatePhotoObject(media) ? 'photos' : 'film';
      const previewUrl = isStatePhotoObject(media)
        ? media.media_cover.formats?.small.url
        : media.video_poster.formats.small.url;

      let visible = false;
      if (!filtered) {
        visible = true;
      }
      if (linkPrefix === 'photos' && filtered === 'photo') {
        visible = true;
      }
      if (linkPrefix === 'film' && filtered === 'video') {
        visible = true;
      }

      return (
        <GridTile key={media.id} visible={visible}>
          <PreloadLink to={`../${linkPrefix}/${media.slug}`}>
            <Figure src={CMS_URL + previewUrl} />
            <Title>{media.title}</Title>
          </PreloadLink>
        </GridTile>
      );
    });
  }

  return (
    <>
      <div id="grid-container">
        <div id="grid-container__body">
          <GridPageContainer ref={containerRef} $visible={fadeIn}>
            <FilterContainer>
              <FilterButton onClick={() => toggleFilter('photo')} toggled={filtered === 'photo'}>
              Photos ({media.allMedia?.photo.length})
              </FilterButton>
              <FilterButton onClick={() => toggleFilter('video')} toggled={filtered === 'video'}>
              Films ({media.allMedia?.video.length})
              </FilterButton>
            </FilterContainer>

            <GridContainer>
              {renderGrid()}
            </GridContainer>
          </GridPageContainer>
        </div>
      </div>
      <div id="grid-container--hitbox" />
    </>
  );
};

export default Grid;
