import React from 'react';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Header from './components/Header';
import PhotoFilmPreview from './components/PhotoFilmPreview';
import PhotoFilmDetail from './components/PhotoFilmDetail';

import { HomeContainer } from './styled';


const Home: React.VFC = () => {
  const match = useRouteMatch();

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
      <Header />
      <Switch>
        <Route path={match.path} exact component={PhotoFilmPreview} />
        <Route path={`${match.path}:id`} exact component={PhotoFilmDetail} />
      </Switch>
    </HomeContainer>
  );
};

export default Home;
