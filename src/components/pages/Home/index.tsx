import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

import useStore from 'state';

import Canvas from './components/Canvas';
import Header from './components/Header';
import { HomeContainer, Name } from './styled';


const Home: React.VFC = () => {
  const state = useStore();

  React.useEffect(() => {
    const body = document.querySelector('body');

    if (!body) {
      return;
    }

    disableBodyScroll(body);

    return function cleanup() {
      enableBodyScroll(body);
    };
  }, []);

  return (
    <HomeContainer>
      <Name show={state.showName}>bedroom</Name>
      <Header />
      <Canvas />
    </HomeContainer>
  );
};

export default Home;
