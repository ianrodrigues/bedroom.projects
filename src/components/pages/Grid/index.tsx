import * as i from 'types';
import React from 'react';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';

import useStore from 'state';
import { isStatePhotoObject } from 'services/typeguards';

import { Figure, FilterContainer, GridContainer, GridPageContainer, GridTile, Title } from './styled';


const Grid: React.VFC<Props> = () => {
  const state = useStore();
  const combinedMedia = React.useRef<(i.StatePhotoObject | i.StateVideoObject)[]>([]);

  React.useEffect(() => {
    if (!state.allMedia) {
      return;
    }

    combinedMedia.current = [...state.allMedia.photo, ...state.allMedia.video];
  }, [state.allMedia]);

  return (
    <GridPageContainer>
      <FilterContainer>
        <button>Photos ({state.allMedia?.photo.length})</button>
        <button>Films ({state.allMedia?.video.length})</button>
      </FilterContainer>

      <GridContainer>
        {combinedMedia.current && combinedMedia.current.map((media) => {
          const linkPrefix = isStatePhotoObject(media) ? 'photos' : 'film';
          const previewUrl = isStatePhotoObject(media)
            ? media.media_cover.formats?.small.url
            : media.video_poster.formats.small.url;

          return (
            <GridTile key={media.id}>
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
