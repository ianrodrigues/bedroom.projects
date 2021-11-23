import React from 'react';

import { useMultiMatchRoute } from 'services/hooks';
import InstagramSvg from 'vectors/instagram-brands.svg';
import VimeoSvg from 'vectors/vimeo-v-brands.svg';

import { InfoLink, SocialMediaLink } from './styled';


const Footer: React.VFC = () => {
  const { multiMatchRoute } = useMultiMatchRoute();
  const visible = !multiMatchRoute(['grid', 'info']);

  return (
    <>
      <InfoLink to="/info" $visible={visible}>
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
