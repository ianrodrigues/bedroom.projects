import * as i from 'types';
import React from 'react';
import { Outlet } from 'react-location';
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
  const [isHomepage, setIsHomepage] = React.useState(!!matchRoute({ to: '/' }));
  const [fullscreenMedia, setFullscreenMedia] = React.useState<i.MediaType | undefined>();
  const [showCanvas, setShowCanvas] = React.useState(isHomepage || state.ui.isAnyMenuOpen());

  React.useEffect(() => {
    fetchMedia();
  }, []);

  React.useEffect(() => {
    setIsHomepage(!!matchRoute({ to: '/' }));

    if (multiMatchRoute(['/', 'grid'])) {
      state.ui.setShowName(true);
    } else {
      state.ui.setShowName(false);
    }
  }, [multiMatchRoute]);

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
      <Outlet /> {/** Renders matching paths from react-location */}
      <RenderCanvas show={showCanvas} fullscreen={fullscreenMedia} />
      <Header />
      <Name show={state.ui.loading === 'site' || state.ui.showName}>bedroom</Name>
      <Loader />
      <Footer />
    </main>
  );
};

export default App;
