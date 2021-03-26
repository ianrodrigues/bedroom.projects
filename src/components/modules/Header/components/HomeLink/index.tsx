import React from 'react';
import { useLocation } from 'react-router';

import { HomeLinkAnchor } from './styled';


const HomeLink: React.VFC = () => {
  const location = useLocation();

  if (['/', '/grid'].includes(location.pathname)) {
    return null;
  }

  return <HomeLinkAnchor to="/">bedroom</HomeLinkAnchor>;
};

export default HomeLink;
