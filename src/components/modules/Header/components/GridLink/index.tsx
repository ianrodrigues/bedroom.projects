import React from 'react';
import { hotjar } from 'react-hotjar';
import { useLocation } from 'react-router';
import { Link, RouteProps } from 'react-router-dom';

import { GridPart, GridToggleContainer } from './styled';


const GridLink: React.VFC<RouteProps> = (props) => {
  const location = useLocation();
  const isGridPage = props.location?.pathname === '/grid';

  return (
    <Link
      to={isGridPage ? '/' : '/grid'}
      onClick={() => __PROD__ && hotjar.stateChange(location.pathname)}
    >
      <GridToggleContainer isGrid={isGridPage}>
        {Array.from({ length: 4 }).map((_, i) => <GridPart key={i} />)}
      </GridToggleContainer>
    </Link>
  );
};

export default GridLink;
