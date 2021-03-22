import * as i from 'types';
import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

import GlobalStyle from 'styles';
import useStore from 'state';

import Header from 'modules/Header';
import Footer from 'common/navigation/Footer';
import RenderCanvas from 'common/presentation/RenderCanvas';

import { Name } from 'common/presentation/Name';
import Loader from './common/presentation/Loader';

const PhotoDetail = React.lazy(() => import('pages/PhotoDetail'));
const VideoDetail = React.lazy(() => import('pages/VideoDetail'));
const Grid = React.lazy(() => import('pages/Grid'));
const Info = React.lazy(() => import('pages/Info'));


const OtherContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
`;


const App: React.VFC<RouteComponentProps> = () => {
  const state = useStore();
  const location = useLocation();
  const [isHomepage, setIsHomepage] = React.useState(location.pathname === '/');
  const [fullscreenMedia, setFullscreenMedia] = React.useState<i.MediaType | undefined>();
  const [showCanvas, setShowCanvas] = React.useState(isHomepage || state.isAnyMenuOpen());
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setIsHomepage(location.pathname === '/');

    if (['/', '/grid'].includes(location.pathname)) {
      state.setShowName(true);
    } else {
      state.setShowName(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    setShowCanvas(isHomepage || state.isAnyMenuOpen());

    if (isHomepage) {
      setFullscreenMedia(undefined);
    } else if (state.isMenuOpen.L) {
      setFullscreenMedia('photo');
    } else if (state.isMenuOpen.R) {
      setFullscreenMedia('video');
    } else {
      setFullscreenMedia(undefined);
    }
  }, [isHomepage, state.isMenuOpen]);

  React.useEffect(() => {
    if (mainRef.current) {
      if (state.loading) {
        disableBodyScroll(mainRef.current);
      } else {
        enableBodyScroll(mainRef.current);
      }
    }

    return function cleanup() {
      if (mainRef.current) {
        enableBodyScroll(mainRef.current);
      }
    };
  }, [mainRef, state.loading]);

  return (
    <main ref={mainRef}>
      <GlobalStyle />
      <React.Suspense fallback={<div />}>
        <Switch>
          <Route path="/photos/:slug" component={PhotoDetail} />
          <Route path="/film/:slug" component={VideoDetail} />
          <Route path="/grid" component={Grid} />
          <Route path="/info" component={Info} />
        </Switch>
      </React.Suspense>
      <OtherContainer>
        <RenderCanvas show={showCanvas} fullscreen={fullscreenMedia} />
        <Header />
        <Name show={state.loading === 'site' || state.showName}>bedroom</Name>
        <Loader />
        <Footer />
      </OtherContainer>
    </main>
  );
};

export default withRouter(App);
