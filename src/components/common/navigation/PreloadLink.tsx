import React from 'react';
import { Link, LinkPropsType } from 'react-location';

import { getMediaObjectBySlug } from 'state/utils';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';


const PreloadLink: React.FC<LinkPropsType> = (props) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const loader = React.useContext(AssetsLoaderContext);
  const { children, ...rest } = props;

  React.useEffect(() => {
    if (!isHovered || typeof props.to !== 'string') {
      return;
    }

    const [, type, slug] = props.to.match(/(photos\/|film\/)(.+)/) || [];

    if (!slug || !type!.includes('photos')) {
      return;
    }

    const media = getMediaObjectBySlug(slug, 'photo');

    if (!media) {
      return;
    }

    for (const row of media.bedroom_media_layouts) {
      for (const photo of row.media) {
        loader?.addImageAsset((img) => {
          img.src = CMS_URL + photo.url;
        });
      }
    }
  }, [isHovered]);

  return (
    <Link {...rest} onMouseOver={() => setIsHovered(true)}>
      {children}
    </Link>
  );
};

export default PreloadLink;
