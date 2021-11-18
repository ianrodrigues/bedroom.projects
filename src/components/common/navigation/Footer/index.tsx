import React from 'react';
import { useLocation } from 'react-location';

import { useHotjar } from 'services/hooks';
import InstagramSvg from 'vectors/instagram-brands.svg';
import VimeoSvg from 'vectors/vimeo-v-brands.svg';

import { InfoLink, SocialMediaLink } from './styled';


const Footer: React.VFC = () => {
  const location = useLocation();
  const [visible, setVisible] = React.useState(false);
  const hotjar = useHotjar();

  React.useEffect(() => {
    const visible = !['/grid', '/info'].includes(location.current.pathname);
    setVisible(visible);
  }, [location.current.pathname]);

  return (
    <>
      <InfoLink
        to="/info"
        $visible={visible}
        onClick={hotjar.stateChange}
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
