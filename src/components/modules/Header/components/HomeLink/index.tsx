import React from 'react';
import { useLocation } from 'react-router';

import { HomeLinkAnchor } from './styled';


const HomeLink: React.VFC = () => {
  const location = useLocation();

  return !['/', '/grid'].includes(location.pathname) ? (
    <HomeLinkAnchor to="/">bedroom</HomeLinkAnchor>
  ) : null;
};

export default HomeLink;
