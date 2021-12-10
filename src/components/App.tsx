import * as i from 'types';
import React from 'react';
import { hotjar } from 'react-hotjar';
import { Outlet, useLocation } from 'react-location';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

import GlobalStyle from 'styles';
import { fetchMedia } from 'state/utils';
import { useEventListener, useMultiMatchRoute, useShallowStore } from 'hooks';

import Header from 'modules/Header';
import Footer from 'common/navigation/Footer';
import RenderCanvas from 'common/presentation/RenderCanvas';

import { Name } from 'common/presentation/Name';
import Loader from './common/presentation/Loader';


const App: React.VFC = () => {
  const ui = useShallowStore(
    'ui',
    ['setShowName', 'isAnyMenuOpen', 'isMenuOpen', 'loading', 'showName', 'setInteracted'],
  );
  const { matchRoute, multiMatchRoute } = useMultiMatchRoute();
  const location = useLocation();
  const [fullscreenMedia, setFullscreenMedia] = React.useState<i.MediaType | undefined>();
  const isHomepage = !!matchRoute({ to: '/' });
  const canvasVisible = isHomepage || ui.isAnyMenuOpen();

  React.useEffect(() => {
    fetchMedia();
  }, []);

  React.useEffect(() => {
    if (multiMatchRoute(['/', 'grid'])) {
      ui.setShowName(true);
    } else {
      ui.setShowName(false);
    }
  }, [multiMatchRoute]);

  React.useEffect(() => {
    if (isHomepage || !ui.isAnyMenuOpen()) {
      setFullscreenMedia(undefined);
    } else if (ui.isMenuOpen.L) {
      setFullscreenMedia('photo');
    } else if (ui.isMenuOpen.R) {
      setFullscreenMedia('video');
    }
  }, [ui.isMenuOpen]);

  React.useEffect(() => {
    const body = document.querySelector('body');

    if (body) {
      if (ui.loading) {
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
  }, [ui.loading]);

  React.useEffect(() => {
    if (__PROD__) {
      hotjar.stateChange(location.current.pathname);
    }
  }, [location.current.pathname]);

  // Check if user has interacted with the page to give JS access to more video functions
  useEventListener('click', onInteraction);

  function onInteraction() {
    ui.setInteracted();
    window.removeEventListener('click', onInteraction);
  }

  return (
    <main>
      <GlobalStyle />
      <Outlet /> {/** Renders matching paths from react-location */}
      <RenderCanvas visible={canvasVisible} fullscreen={fullscreenMedia} />
      <Header />
      <Name $visible={ui.loading === 'site' || ui.showName}>bedroom</Name>
      <Loader />
      <Footer />
    </main>
  );
};

export default App;
