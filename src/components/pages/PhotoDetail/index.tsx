import React from 'react';
import { useParams } from 'react-router';

import { getMediaObjectBySlug } from 'state/utils';

import { PhotoDetailContainer } from './styled';


const PhotoDetail: React.VFC = () => {
  const params = useParams<{ slug: string }>();
  const [layout, setLayout] = React.useState(getMediaObjectBySlug(params.slug, 'photo'));

  React.useEffect(() => {
    setLayout(getMediaObjectBySlug(params.slug, 'photo'));
  }, [params.slug]);

  return (
    <PhotoDetailContainer>
      <div>
        {layout && (
          <img src={CMS_URL + layout.bedroom_media_layouts[0]?.media.url} alt="head" />
        )}
      </div>
      <div>body/scroll piece</div>
      <div>next piece</div>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
