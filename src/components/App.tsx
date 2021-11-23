import * as i from 'types';
import React from 'react';
import { hotjar } from 'react-hotjar';
import { Outlet, useLocation } from 'react-location';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

import GlobalStyle from 'styles';
import useStore from 'state';
import { fetchMedia } from 'state/utils';
import { useMultiMatchRoute } from 'hooks';

import Header from 'modules/Header';
import Footer from 'common/navigation/Footer';
import RenderCanvas from 'common/presentation/RenderCanvas';

import { Name } from 'common/presentation/Name';
import Loader from './common/presentation/Loader';


const App: React.VFC = () => {
  const state = useStore();
  const { matchRoute, multiMatchRoute } = useMultiMatchRoute();
  const location = useLocation();
  const [fullscreenMedia, setFullscreenMedia] = React.useState<i.MediaType | undefined>();
  const isHomepage = !!matchRoute({ to: '/' });
  const canvasVisible = isHomepage || state.ui.isAnyMenuOpen();

  React.useEffect(() => {
    fetchMedia();
  }, []);

  React.useEffect(() => {
    if (multiMatchRoute(['/', 'grid'])) {
      state.ui.setShowName(true);
    } else {
      state.ui.setShowName(false);
    }
  }, [multiMatchRoute]);

  React.useEffect(() => {
    if (isHomepage || !state.ui.isAnyMenuOpen()) {
      setFullscreenMedia(undefined);
    } else if (state.ui.isMenuOpen.L) {
      setFullscreenMedia('photo');
    } else if (state.ui.isMenuOpen.R) {
      setFullscreenMedia('video');
    }
  }, [state.ui.isMenuOpen]);

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

  React.useEffect(() => {
    if (__PROD__) {
      hotjar.stateChange(location.current.pathname);
    }
  }, [location.current.pathname]);

  return (
    <main>
      <GlobalStyle />
      <Outlet /> {/** Renders matching paths from react-location */}
      <RenderCanvas visible={canvasVisible} fullscreen={fullscreenMedia} />
      <Header />
      <Name $visible={state.ui.loading === 'site' || state.ui.showName}>bedroom</Name>
      <Loader />
      <Footer />
    </main>
  );
};

export default App;
