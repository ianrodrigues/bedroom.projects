import React from 'react';

import { HomeContainer } from './styled';

import Canvas from './components/Canvas';


const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Canvas />
    </HomeContainer>
  );
};

export default Home;
