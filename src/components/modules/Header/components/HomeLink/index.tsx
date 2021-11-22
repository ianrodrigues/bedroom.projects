import React from 'react';

import { useHotjar } from 'hooks';

import { HomeLinkAnchor } from './styled';


const HomeLink: React.VFC = () => {
  const hotjar = useHotjar();

  return (
    <HomeLinkAnchor to="/" onClick={hotjar.stateChange}>
      bedroom
    </HomeLinkAnchor>
  );
};

export default HomeLink;
