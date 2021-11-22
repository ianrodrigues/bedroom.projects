import React from 'react';

import { useHotjar, useMultiMatchRoute } from 'hooks';

import { HomeLinkAnchor } from './styled';


const HomeLink: React.VFC = () => {
  const hotjar = useHotjar();
  const { multiMatchRoute } = useMultiMatchRoute();

  if (multiMatchRoute(['/', 'grid'])) {
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
