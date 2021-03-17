import React from 'react';
import { useLocation } from 'react-router-dom';

import InstagramSvg from 'vectors/instagram-brands.svg';
import VimeoSvg from 'vectors/vimeo-v-brands.svg';

import { InfoLink, SocialMediaLinksContainer } from './styled';


const Footer: React.VFC = () => {
  const location = useLocation();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const visible = !['/grid', '/info'].includes(location.pathname);
    setVisible(visible);
  }, [location.pathname]);

  return (
    <>
      <InfoLink to="/info" $visible={visible}>Info</InfoLink>
      <SocialMediaLinksContainer $visible={visible}>
        <a href="https://www.instagram.com/bedroom.projects/" target="_blank" rel="noreferrer">
          <InstagramSvg />
        </a>
        <a href="https://vimeo.com/bedroomprojects" target="_blank" rel="noreferrer">
          <VimeoSvg />
        </a>
      </SocialMediaLinksContainer>
    </>
  );
};

export default Footer;
