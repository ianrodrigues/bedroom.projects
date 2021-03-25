import * as i from 'types';
import React from 'react';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';

import useStore from 'state';
import { SmoothScroll } from 'services';
import { isStatePhotoObject } from 'services/typeguards';

import {
  Figure, FilterContainer, GridContainer, GridPageContainer, GridTile, Title, FilterButton,
} from './styled';


let scroller: SmoothScroll | undefined;
let loaded = 0;

const Grid: React.VFC<Props> = () => {
  const state = useStore();
  const combinedMedia = React.useRef<(i.StatePhotoObject | i.StateVideoObject)[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [filtered, setFiltered] = React.useState<false | i.MediaType>(false);
  const [fadeIn, setFadeIn] = React.useState(false);

  React.useEffect(() => {
    scroller = new SmoothScroll('#grid-container');

    return function cleanup() {
      scroller?.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (!state.allMedia) {
      return;
    }

    combinedMedia.current = [...state.allMedia.photo, ...state.allMedia.video];

    if (loaded === 0) {
      if (state.loading === false) {
        state.setLoading('page');
      }

      for (const media of combinedMedia.current) {
        const img = document.createElement('img');
        img.onload = handleMediaLoaded;

        if (isStatePhotoObject(media)) {
          img.src = CMS_URL + media.media_cover.formats!.small.url;
        } else {
          img.src = CMS_URL + media.video_poster.formats!.small.url;
        }
      }
    } else {
      handleMediaLoaded();
    }
  }, [state.allMedia]);

  function handleMediaLoaded() {
    loaded++;

    if (loaded >= combinedMedia.current.length) {
      state.setLoading(false);

      setTimeout(() => {
        setFadeIn(true);
      }, 750);
    }
  }

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

      if (
        !filtered ||
        (linkPrefix === 'photos' && filtered === 'photo') ||
        (linkPrefix === 'film' && filtered === 'video')
      ) {
        visible = true;
      }

      return (
        <GridTile key={media.id} visible={visible}>
          <Link to={`${linkPrefix}/${media.slug}`}>
            <Figure src={CMS_URL + previewUrl} />
            <Title>{media.title}</Title>
          </Link>
        </GridTile>
      );
    });
  }

  return (
    <>
      <div id="grid-container">
        <div id="grid-container__body">
          <GridPageContainer ref={containerRef} visible={fadeIn}>
            <FilterContainer>
              <FilterButton onClick={() => toggleFilter('photo')} toggled={filtered === 'photo'}>
              Photos ({state.allMedia?.photo.length})
              </FilterButton>
              <FilterButton onClick={() => toggleFilter('video')} toggled={filtered === 'video'}>
              Films ({state.allMedia?.video.length})
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

interface Props extends RouteProps {}

export default Grid;
