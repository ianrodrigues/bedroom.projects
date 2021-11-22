import * as i from 'types';
import React from 'react';
import { Link, useLocation } from 'react-location';

import useStore from 'state';
import { useHotjar, useMultiMatchRoute } from 'hooks';

import HomeLink from './components/HomeLink';
import GridLink from './components/GridLink';
import {
  HeaderContainer, List, ListItem, Nav, H2, NavContainer, HomeGridLinkContainer,
} from './styled';


const Header: React.VFC = () => {
  const state = useStore();
  const location = useLocation();
  const { multiMatchRoute, matchRoute } = useMultiMatchRoute();
  const hotjar = useHotjar();
  const visible = !matchRoute({ to: '/grid' });

  React.useEffect(() => {
    setTimeout(() => {
      state.ui.closeMenus();
    }, 300); // Small delay for animations
  }, [location.current.pathname]);

  function onMouseEnter(type: i.MediaType, media: i.StatePhotoObject | i.StateVideoObject) {
    state.media.setMedia(type, media);
  }

  function onMouseEnterList() {
    state.ui.setFullscreen(true);
  }

  function onMouseLeaveList() {
    state.ui.setFullscreen(false);
    state.ui.closeMenus();
  }

  function onMouseEnterNav(side: i.Side) {
    if (visible) {
      state.ui.setMenuOpen(side, true);
    }
  }

  function onMouseLeaveNavContainer() {
    if (state.ui.isAnyMenuOpen()) {
      state.ui.closeMenus();
    }
  }

  return (
    <HeaderContainer isOpen={state.ui.isAnyMenuOpen()}>
      <Nav>
        <NavContainer
          isOpen={state.ui.isMenuOpen.L}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('L')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('L')}>
            Photo
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {state.media.allMedia?.photo.map((photo) => (
              <ListItem key={photo.id} onMouseEnter={() => onMouseEnter('photo', photo)}>
                <Link to={`/photos/${photo.slug}`} onClick={hotjar.stateChange}>
                  {photo.title}
                </Link>
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
          isOpen={state.ui.isMenuOpen.R}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('R')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('R')}>
            Film
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {state.media.allMedia?.video.map((video) => (
              <ListItem key={video.id} onMouseEnter={() => onMouseEnter('video', video)}>
                <Link to={`/film/${video.slug}`} onClick={hotjar.stateChange}>
                  {video.title}
                </Link>
              </ListItem>
            ))}
          </List>
        </NavContainer>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
