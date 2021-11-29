import React from 'react';
import { Link, LinkPropsType } from 'react-location';

import { getMediaObjectBySlug } from 'state/utils';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';


const PreloadLink: React.FC<LinkPropsType> = (props) => {
  const LinkRef = React.useRef<HTMLAnchorElement>(null);
  const loader = React.useContext(AssetsLoaderContext);
  const { children, ...rest } = props;

  React.useEffect(() => {
    LinkRef.current?.addEventListener('mouseover', onMouseOver);

    return function cleanup() {
      LinkRef.current?.removeEventListener('mouseover', onMouseOver);
    };
  }, [LinkRef.current]);

  function onMouseOver() {
    // Remove to prevent future mouseover events
    LinkRef.current?.removeEventListener('mouseover', onMouseOver);

    if (typeof props.to !== 'string') {
      return;
    }

    const [, type, slug] = props.to.match(/(photos|film)\/(.+)/) || [];

    if (!slug || type !== 'photos') {
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
  }

  return (
    <Link {...rest} _ref={LinkRef}>
      {children}
    </Link>
  );
};

export default PreloadLink;
