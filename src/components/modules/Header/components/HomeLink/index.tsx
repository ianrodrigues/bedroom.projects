import React from 'react';
import { useLocation } from 'react-location';

import { useHotjar } from 'hooks';

import { HomeLinkAnchor } from './styled';


const HomeLink: React.VFC = () => {
  const location = useLocation();
  const hotjar = useHotjar();

  if (['/', '/grid'].includes(location.current.pathname)) {
    return null;
  }

  return (
    <HomeLinkAnchor
      to="/"
      onClick={hotjar.stateChange}
    >
      bedroom
    </HomeLinkAnchor>
  );
};

export default HomeLink;
