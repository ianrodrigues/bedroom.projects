import * as i from 'types';
import React from 'react';
import { Link, useLocation } from 'react-location';

import useStore from 'state';
import { useHotjar } from 'hooks';

import HomeLink from './components/HomeLink';
import GridLink from './components/GridLink';
import {
  HeaderContainer, List, ListItem, Nav, H2, NavContainer, HomeGridLinkContainer,
} from './styled';


const Header: React.VFC = () => {
  const location = useLocation();
  const state = useStore();
  const hotjar = useHotjar();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    state.ui.closeMenus();

    const visible = location.current.pathname !== '/grid';
    setVisible(visible);
  }, [location.current.pathname]);

  function onMouseEnter(type: i.MediaType, media: i.StatePhotoObject | i.StateVideoObject) {
    state.media.setMedia(type, media);
  }

  function onMouseEnterList() {
    state.ui.setFullscreen(true);
  }

  function onMouseLeaveList() {
    state.ui.setFullscreen(false);

    if (location.current.pathname !== '/') {
      state.ui.closeMenus();
    }
  }

  function onMouseEnterNav(tag: 'container' | 'title', side: i.Side) {
    if (tag === 'title' || (tag === 'container' && location.current.pathname === '/')) {
      if (visible) {
        state.ui.setMenuOpen(side, true);
      }
    }
  }

  function onMouseLeaveNavContainer() {
    if (state.ui.isAnyMenuOpen() && location.current.pathname !== '/') {
      state.ui.closeMenus();
    }
  }

  return (
    <HeaderContainer isOpen={state.ui.isAnyMenuOpen()}>
      <Nav>
        <NavContainer
          isOpen={state.ui.isMenuOpen.L}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('container', 'L')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('title', 'L')}>
            Photo
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {state.media.allMedia && state.media.allMedia.photo.map((photo) => (
              <ListItem
                key={photo.id}
                onMouseEnter={() => onMouseEnter('photo', photo)}
              >
                <Link
                  to={`/photos/${photo.slug}`}
                  onClick={hotjar.stateChange}
                >
                  {photo.title}
                </Link>
              </ListItem>
            ))}
          </List>
        </NavContainer>

        <HomeGridLinkContainer>
          {['/', '/grid'].includes(location.current.pathname) && (
            <GridLink />
          )}
          <HomeLink />
        </HomeGridLinkContainer>

        <NavContainer
          isOpen={state.ui.isMenuOpen.R}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('container', 'R')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('title', 'R')}>
            Film
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {state.media.allMedia && state.media.allMedia.video.map((video) => (
              <ListItem
                key={video.id}
                onMouseEnter={() => onMouseEnter('video', video)}
              >
                <Link
                  to={`/film/${video.slug}`}
                  onClick={hotjar.stateChange}
                >
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
