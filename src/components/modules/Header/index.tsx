import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-location';
import shallow from 'zustand/shallow';

import useStore, { selectors } from 'state';
import { useMultiMatchRoute } from 'hooks';

import PreloadLink from 'common/navigation/PreloadLink';
import HomeLink from './components/HomeLink';
import GridLink from './components/GridLink';
import {
  HeaderContainer, List, ListItem, Nav, H2, NavContainer, HomeGridLinkContainer,
} from './styled';


const Header: React.VFC = () => {
  const {
    closeMenus, setMenuOpen, isAnyMenuOpen, isMenuOpen, setFullscreen: setCanvasFullscreen,
  } = useStore(selectors.ui, shallow);
  const { setMedia, allMedia: allStateMedia } = useStore(selectors.media, shallow);
  const location = useLocation();
  const { multiMatchRoute, matchRoute } = useMultiMatchRoute();
  const visible = !matchRoute({ to: '/grid' });

  React.useEffect(() => {
    setTimeout(() => {
      closeMenus();
    }, 300); // Small delay for animations
  }, [location.current.pathname, closeMenus]);

  function onMouseEnter(type: i.MediaType, media: i.StatePhotoObject | i.StateVideoObject) {
    setMedia(type, media);
  }

  function onMouseEnterList() {
    setCanvasFullscreen(true);
  }

  function onMouseLeaveList() {
    setCanvasFullscreen(false);
    closeMenus();
  }

  function onMouseEnterNav(side: i.Side) {
    if (visible) {
      setMenuOpen(side, true);
    }
  }

  function onMouseLeaveNavContainer() {
    if (isAnyMenuOpen()) {
      closeMenus();
    }
  }

  return (
    <HeaderContainer isOpen={isAnyMenuOpen()}>
      <Nav>
        <NavContainer
          isOpen={isMenuOpen.L}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('L')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('L')}>
            Photo
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {allStateMedia?.photo.map((photo) => (
              <ListItem key={photo.id} onMouseEnter={() => onMouseEnter('photo', photo)}>
                <PreloadLink to={`/photos/${photo.slug}`}>
                  {photo.title}
                </PreloadLink>
              </ListItem>
            ))}
          </List>
        </NavContainer>

        <HomeGridLinkContainer>
          {multiMatchRoute(['/', 'grid']) ? (
            <GridLink />
          ) : (
            <HomeLink />
          )}
        </HomeGridLinkContainer>

        <NavContainer
          isOpen={isMenuOpen.R}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('R')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('R')}>
            Film
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {allStateMedia?.video.map((video) => (
              <ListItem key={video.id} onMouseEnter={() => onMouseEnter('video', video)}>
                <PreloadLink to={`/film/${video.slug}`}>
                  {video.title}
                </PreloadLink>
              </ListItem>
            ))}
          </List>
        </NavContainer>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
