import * as i from 'types';
import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps, useLocation } from 'react-router-dom';

import useStore from 'state';
import GlobalStyle from 'styles';

import Header from 'common/navigation/Header';
import RenderCanvas from 'common/presentation/RenderCanvas';

const PhotoDetail = React.lazy(() => import('pages/PhotoDetail'));
const VideoDetail = React.lazy(() => import('pages/VideoDetail'));

const App: React.VFC<RouteComponentProps> = () => {
  const state = useStore();
  const location = useLocation();
  const [isHomepage, setIsHomepage] = React.useState(location.pathname === '/');
  const [fullscreenMedia, setFullscreenMedia] = React.useState<i.MediaType | undefined>();
  const [showCanvas, setShowCanvas] = React.useState(
    isHomepage || state.isMenuOpen.L || state.isMenuOpen.R,
  );

  React.useEffect(() => {
    setIsHomepage(location.pathname === '/');
  }, [location.pathname]);

  React.useEffect(() => {
    setShowCanvas(isHomepage || state.isMenuOpen.L || state.isMenuOpen.R);

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

  return (
    <main>
      <GlobalStyle />
      <RenderCanvas show={showCanvas} fullscreen={fullscreenMedia} />
      <Header />
      <React.Suspense fallback={<div />}>
        <Switch>
          <Route path="/photos/:slug" component={PhotoDetail} />
          <Route path="/film/:slug" component={VideoDetail} />
        </Switch>
      </React.Suspense>
    </main>
  );
};

export default withRouter(App);
