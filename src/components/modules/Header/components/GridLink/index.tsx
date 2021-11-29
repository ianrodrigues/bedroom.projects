import React from 'react';
import { Link, useMatchRoute } from 'react-location';

import { GridPart, GridToggleContainer } from './styled';


const GridLink: React.VFC = () => {
  const matchRoute = useMatchRoute();
  const isGridPage = !!matchRoute({ to: 'grid' });

  return (
    <Link to={isGridPage ? '/' : '/grid'}>
      <GridToggleContainer isGrid={isGridPage}>
        {Array.from({ length: 4 }).map((_, i) => <GridPart key={i} />)}
      </GridToggleContainer>
    </Link>
  );
};

export default GridLink;
