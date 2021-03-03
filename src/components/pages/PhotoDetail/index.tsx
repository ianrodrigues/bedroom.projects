import React from 'react';
import { useParams } from 'react-router';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';

import { PhotoDetailContainer } from './styled';


const PhotoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<{ slug: string }>();
  const [detail, setDetail] = React.useState(getMediaObjectBySlug(params.slug, 'photo'));

  React.useEffect(() => {
    setDetail(getMediaObjectBySlug(params.slug, 'photo'));
  }, [params.slug, state.allMedia]);

  return (
    <PhotoDetailContainer>
      <div>
        {detail && (
          <img src={CMS_URL + detail.bedroom_media_layouts[0]?.media.url} alt="head" />
        )}
      </div>
      <div>body/scroll piece</div>
      <div>next piece</div>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
