import React from 'react';
import { Link, RouteProps } from 'react-router-dom';

import { GridPart, GridToggleContainer } from './styled';


const GridLink: React.VFC<RouteProps> = (props) => {
  const isGridPage = props.location?.pathname === '/grid';

  return (
    <Link to={isGridPage ? '/' : '/grid'}>
      <GridToggleContainer isGrid={isGridPage}>
        {Array.from({ length: 4 }).map((_, i) => <GridPart key={i} />)}
      </GridToggleContainer>
    </Link>
  );
};

export default GridLink;
