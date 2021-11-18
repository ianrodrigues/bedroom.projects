import React from 'react';
import { Link, useLocation } from 'react-location';

import { useHotjar } from 'hooks';
import { GridPart, GridToggleContainer } from './styled';


const GridLink: React.VFC = (props) => {
  const location = useLocation();
  const hotjar = useHotjar();
  const isGridPage = location.current.pathname === '/grid';

  return (
    <Link
      to={isGridPage ? '/' : '/grid'}
      onClick={hotjar.stateChange}
    >
      <GridToggleContainer isGrid={isGridPage}>
        {Array.from({ length: 4 }).map((_, i) => <GridPart key={i} />)}
      </GridToggleContainer>
    </Link>
  );
};

export default GridLink;
