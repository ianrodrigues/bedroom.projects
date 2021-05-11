import * as i from 'types';
import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps, useLocation } from 'react-router-dom';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import { hotjar } from 'react-hotjar';

import GlobalStyle from 'styles';
import useStore from 'state';
import { fetchMedia } from 'state/utils';

import Header from 'modules/Header';
import Footer from 'common/navigation/Footer';
import RenderCanvas from 'common/presentation/RenderCanvas';

import { Name } from 'common/presentation/Name';
import Loader from './common/presentation/Loader';

const PhotoDetail = React.lazy(() => import('pages/PhotoDetail'));
const VideoDetail = React.lazy(() => import('pages/VideoDetail'));
const Grid = React.lazy(() => import('pages/Grid'));
const Info = React.lazy(() => import('pages/Info'));


if (__PROD__) {
  hotjar.initialize(HOTJAR_ID, HOTJAR_SNIPPET_V);
}


const App: React.VFC<RouteComponentProps> = () => {
  const state = useStore();
  const location = useLocation();
  const [isHomepage, setIsHomepage] = React.useState(location.pathname === '/');
  const [fullscreenMedia, setFullscreenMedia] = React.useState<i.MediaType | undefined>();
  const [showCanvas, setShowCanvas] = React.useState(isHomepage || state.ui.isAnyMenuOpen());

  React.useEffect(() => {
    fetchMedia();
  }, []);

  React.useEffect(() => {
    setIsHomepage(location.pathname === '/');

    if (['/', '/grid'].includes(location.pathname)) {
      state.ui.setShowName(true);
    } else {
      state.ui.setShowName(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    setShowCanvas(isHomepage || state.ui.isAnyMenuOpen());

    if (isHomepage || !state.ui.isAnyMenuOpen()) {
      setFullscreenMedia(undefined);
    } else if (state.ui.isMenuOpen.L) {
      setFullscreenMedia('photo');
    } else if (state.ui.isMenuOpen.R) {
      setFullscreenMedia('video');
    }
  }, [isHomepage, state.ui.isMenuOpen]);

  React.useEffect(() => {
    const body = document.querySelector('body');

    if (body) {
      if (state.ui.loading) {
        disableBodyScroll(body);
      } else {
        enableBodyScroll(body);
      }
    }

    return function cleanup() {
      if (body) {
        enableBodyScroll(body);
      }
    };
  }, [state.ui.loading]);

  return (
    <main>
      <GlobalStyle />
      <React.Suspense fallback={<div />}>
        <Switch>
          <Route path="/photos/:slug" component={PhotoDetail} />
          <Route path="/film/:slug" component={VideoDetail} />
          <Route path="/grid" component={Grid} />
          <Route path="/info" component={Info} />
        </Switch>
      </React.Suspense>
      <RenderCanvas show={showCanvas} fullscreen={fullscreenMedia} />
      <Header />
      <Name show={state.ui.loading === 'site' || state.ui.showName}>bedroom</Name>
      <Loader />
      <Footer />
    </main>
  );
};

export default withRouter(App);
