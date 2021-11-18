import React from 'react';
import { hotjar } from 'react-hotjar';
import { useLocation } from 'react-router-dom';

import InstagramSvg from 'vectors/instagram-brands.svg';
import VimeoSvg from 'vectors/vimeo-v-brands.svg';

import { InfoLink, SocialMediaLink } from './styled';


const Footer: React.VFC = () => {
  const location = useLocation();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const visible = !['/grid', '/info'].includes(location.pathname);
    setVisible(visible);
  }, [location.pathname]);

  return (
    <>
      <InfoLink
        to="/info"
        $visible={visible}
        onClick={() => __PROD__ && hotjar.stateChange(location.pathname)}
      >
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
