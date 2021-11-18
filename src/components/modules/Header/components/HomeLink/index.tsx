import React from 'react';
import { hotjar } from 'react-hotjar';
import { useLocation } from 'react-router';

import { HomeLinkAnchor } from './styled';


const HomeLink: React.VFC = () => {
  const location = useLocation();

  if (['/', '/grid'].includes(location.pathname)) {
    return null;
  }

  return (
    <HomeLinkAnchor
      to="/"
      onClick={() => __PROD__ && hotjar.stateChange(location.pathname)}
    >
      bedroom
    </HomeLinkAnchor>
  );
};

export default HomeLink;
