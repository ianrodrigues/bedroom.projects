import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import GlobalStyle from 'styles';

import Header from 'common/navigation/Header';
const PhotoDetail = React.lazy(() => import('pages/PhotoDetail'));
const PhotoFilmPreview = React.lazy(() => import('pages/PhotoFilmPreview'));

const App: React.VFC<RouteComponentProps> = () => {
  return (
    <main>
      <GlobalStyle />
      <Header />
      <React.Suspense fallback={<div />}>
        <Switch>
          <Route path="/" component={PhotoFilmPreview} exact />
          <Route path="/photos/:slug" component={PhotoDetail} />
          {/* <Route path="/film/:slug" component={PhotoDetail} /> */}
        </Switch>
      </React.Suspense>
    </main>
  );
};

export default withRouter(App);
