import * as i from 'types';
import React from 'react';
import { Link, Route, useLocation } from 'react-router-dom';

import useStore from 'state';

import HomeLink from './components/HomeLink';
import GridLink from './components/GridLink';
import {
  HeaderContainer, List, ListItem, Nav, H2, NavContainer, HomeGridLinkContainer,
} from './styled';


const Header: React.VFC = () => {
  const location = useLocation();
  const state = useStore();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    state.closeMenus();

    const visible = location.pathname !== '/grid';
    setVisible(visible);
  }, [location.pathname]);

  function onMouseEnter(type: i.MediaType, media: i.StatePhotoObject | i.StateVideoObject) {
    state.setMedia(type, media);
  }

  function onMouseEnterList() {
    state.setFullscreen(true);
  }

  function onMouseLeaveList() {
    state.setFullscreen(false);

    if (location.pathname !== '/') {
      state.closeMenus();
    }
  }

  function onMouseEnterNav(tag: 'container' | 'title', side: i.Side) {
    if (tag === 'title' || (tag === 'container' && location.pathname === '/')) {
      if (visible) {
        state.setMenuOpen(side, true);
      }
    }
  }

  function onMouseLeaveNavContainer() {
    if (state.isAnyMenuOpen() && location.pathname !== '/') {
      state.closeMenus();
    }
  }

  return (
    <HeaderContainer isOpen={state.isAnyMenuOpen()}>
      <Nav>
        <NavContainer
          isOpen={state.isMenuOpen.L}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('container', 'L')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('title', 'L')}>
            Photo
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {state.allMedia && state.allMedia.photo.map((photo) => (
              <ListItem
                key={photo.id}
                onMouseEnter={() => onMouseEnter('photo', photo)}
              >
                <Link to={`/photos/${photo.slug}`}>
                  {photo.title}
                </Link>
              </ListItem>
            ))}
          </List>
        </NavContainer>

        <HomeGridLinkContainer>
          <Route path={['/', '/grid']} exact component={GridLink} />
          <HomeLink />
        </HomeGridLinkContainer>

        <NavContainer
          isOpen={state.isMenuOpen.R}
          visible={visible}
          onMouseEnter={() => onMouseEnterNav('container', 'R')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2 onMouseEnter={() => onMouseEnterNav('title', 'R')}>
            Film
          </H2>
          <List onMouseEnter={onMouseEnterList} onMouseLeave={onMouseLeaveList}>
            {state.allMedia && state.allMedia.video.map((video) => (
              <ListItem
                key={video.id}
                onMouseEnter={() => onMouseEnter('video', video)}
              >
                <Link to={`/film/${video.slug}`}>
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
