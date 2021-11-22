import React from 'react';

import { useHotjar, useMultiMatchRoute } from 'services/hooks';
import InstagramSvg from 'vectors/instagram-brands.svg';
import VimeoSvg from 'vectors/vimeo-v-brands.svg';

import { InfoLink, SocialMediaLink } from './styled';


const Footer: React.VFC = () => {
  const { multiMatchRoute } = useMultiMatchRoute();
  const [visible, setVisible] = React.useState(false);
  const hotjar = useHotjar();

  React.useEffect(() => {
    const visible = !multiMatchRoute(['grid', 'info']);
    setVisible(visible);
  }, [multiMatchRoute]);

  return (
    <>
      <InfoLink to="/info" $visible={visible} onClick={hotjar.stateChange}>
        Info
      </InfoLink>
      <SocialMediaLink href="https://www.instagram.com/bedroom.projects/" $visible={visible}>
        <InstagramSvg />
      </SocialMediaLink>
      <SocialMediaLink href="https://vimeo.com/bedroomprojects" $visible={visible}>
        <VimeoSvg />
      </SocialMediaLink>
    </>
  );
};

export default Footer;
