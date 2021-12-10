import * as i from 'types';
import React from 'react';
import { useLocation } from 'react-location';

import { useMultiMatchRoute, useShallowStore } from 'hooks';

import PreloadLink from 'common/navigation/PreloadLink';
import HomeLink from './components/HomeLink';
import GridLink from './components/GridLink';
import {
  HeaderContainer, List, ListItem, Nav, H2, NavContainer, HomeGridLinkContainer,
} from './styled';


const Header: React.VFC = () => {
  const ui = useShallowStore(
    'ui',
    ['closeMenus', 'setMenuOpen', 'isAnyMenuOpen', 'isMenuOpen', 'setFullscreen'],
  );
  const stateMedia = useShallowStore('media', ['setMedia', 'allMedia']);
  const location = useLocation();
  const { multiMatchRoute, matchRoute } = useMultiMatchRoute();
  const visible = !matchRoute({ to: '/grid' });

  React.useEffect(() => {
    setTimeout(() => {
      ui.closeMenus();
    }, 300); // Small delay for animations
  }, [location.current.pathname, ui.closeMenus]);

  function onMouseEnter(type: i.MediaType, media: i.StatePhotoObject | i.StateVideoObject) {
    stateMedia.setMedia(type, media);
  }

  function onMouseEnterList() {
    ui.setFullscreen(true);
  }

  function onMouseLeaveList() {
    ui.setFullscreen(false);
    ui.closeMenus();
  }

  function onMouseEnterNav(side: i.Side) {
    if (visible) {
      ui.setMenuOpen(side, true);
    }
  }

  function onMouseLeaveNavContainer() {
    if (ui.isAnyMenuOpen()) {
      ui.closeMenus();
    }
  }

  return (
    <HeaderContainer isOpen={ui.isAnyMenuOpen()}>
      <Nav>
        <NavContainer
          isOpen={ui.isMenuOpen.L}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('L')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('L')}>
            Photo
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {stateMedia.allMedia?.photo.map((photo) => (
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
          isOpen={ui.isMenuOpen.R}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('R')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('R')}>
            Film
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {stateMedia.allMedia?.video.map((video) => (
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
