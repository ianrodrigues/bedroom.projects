import * as i from 'types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import useStore from 'state';

import FullscreenCanvas from 'common/presentation/FullscreenCanvas';
import { HeaderContainer, List, ListItem, Nav, H2, NavContainer } from './styled';


const Header: React.VFC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState({
    L: false,
    R: false,
  });
  const location = useLocation();
  const state = useStore();

  React.useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen({
        L: false,
        R: false,
      });
    }
  }, [location.pathname]);

  function onMouseEnter(type: i.MediaType, media: i.APIMediaObject) {
    if (location.pathname === '/') {
      state.setMedia(type, media);
    }
  }

  function onMouseEnterList() {
    state.setFullscreen(true);
  }

  function onMouseLeaveList() {
    state.setFullscreen(false);

    if (location.pathname !== '/') {
      setIsMenuOpen({
        L: false,
        R: false,
      });
    }
  }

  function onMouseEnterNav(tag: 'container' | 'title', side: 'L' | 'R') {
    if (tag === 'title' || (tag === 'container' && location.pathname === '/')) {
      setIsMenuOpen((prev) => ({
        ...prev,
        [side]: true,
      }));
    }
  }

  function onMouseLeaveNavContainer() {
    setIsMenuOpen({
      L: false,
      R: false,
    });
  }

  return (
    <HeaderContainer>
      {location.pathname !== '/' && <FullscreenCanvas />}
      <Nav>
        <NavContainer
          isOpen={isMenuOpen.L}
          onMouseEnter={() => onMouseEnterNav('container', 'L')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2
            onMouseEnter={() => onMouseEnterNav('title', 'L')}
          >
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

        <NavContainer
          isOpen={isMenuOpen.R}
          onMouseEnter={() => onMouseEnterNav('container', 'R')}
          onMouseLeave={onMouseLeaveNavContainer}
        >
          <H2
            onMouseEnter={() => onMouseEnterNav('title', 'R')}
          >
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
