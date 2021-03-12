import * as i from 'types';
import React from 'react';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';
import { isStatePhotoObject } from 'services/typeguards';

import {
  Figure, FilterContainer, GridContainer, GridPageContainer, GridTile, Title, FilterButton,
} from './styled';


let scroller: VirtualScroll;
let containerTop = 0;

const Grid: React.VFC<Props> = () => {
  const state = useStore();
  const combinedMedia = React.useRef<(i.StatePhotoObject | i.StateVideoObject)[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [filtered, setFiltered] = React.useState<false | i.MediaType>(false);

  React.useEffect(() => {
    if (!state.allMedia) {
      return;
    }

    combinedMedia.current = [...state.allMedia.photo, ...state.allMedia.video];
  }, [state.allMedia]);

  React.useEffect(() => {
    scroller = new VirtualScroll({
      mouseMultiplier: .3,
    });

    scroller.on((scroll) => {
      if (!containerRef.current) {
        return;
      }

      // Disable scrolling past top
      if (scroll.y > 0) {
        scroll.y = 0;
        scroller.__private_3_event.y = 0;
      }

      const containerBounds = containerRef.current.getBoundingClientRect();

      if (containerTop === 0) {
        containerTop = containerBounds.top;
      }

      const PADDING = 50;
      const bottomEdge = containerBounds.height - window.innerHeight + containerTop + PADDING;

      if (Math.abs(scroll.y) < bottomEdge) {
        containerRef.current.style.transform = `translate3d(0, ${scroll.y}px, 0)`;
      } else {
        // Stop scroll momentum
        scroll.y = -bottomEdge;
        scroller.__private_3_event.y = -bottomEdge;
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, []);

  function toggleFilter(type: i.MediaType) {
    if (filtered === type) {
      setFiltered(false);
    } else {
      setFiltered(type);
    }
  }

  return (
    <GridPageContainer ref={containerRef}>
      <FilterContainer>
        <FilterButton onClick={() => toggleFilter('photo')} toggled={filtered === 'photo'}>
          Photos ({state.allMedia?.photo.length})
        </FilterButton>
        <FilterButton onClick={() => toggleFilter('video')} toggled={filtered === 'video'}>
          Films ({state.allMedia?.video.length})
        </FilterButton>
      </FilterContainer>

      <GridContainer>
        {combinedMedia.current && combinedMedia.current.map((media) => {
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
        })}
      </GridContainer>
    </GridPageContainer>
  );
};

interface Props extends RouteProps {}

export default Grid;
