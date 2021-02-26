import React from 'react';

import useStore from 'state';

import Canvas from './components/Canvas';
import Header from './components/Header';
import { HomeContainer, Name } from './styled';


const Home: React.VFC = () => {
  const state = useStore();

  return (
    <HomeContainer>
      <Name show={state.showName}>bedroom</Name>
      <Header />
      <Canvas />
    </HomeContainer>
  );
};

export default Home;
