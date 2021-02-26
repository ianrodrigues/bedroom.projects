import React from 'react';

import { HomeContainer } from './styled';

import Canvas from './components/Canvas';
import Header from './components/Header';


const Home: React.VFC = () => {
  return (
    <HomeContainer>
      <Header />
      <Canvas />
    </HomeContainer>
  );
};

export default Home;
