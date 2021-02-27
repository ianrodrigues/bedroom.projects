import React from 'react';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import mediaDb from 'services/mediaDB';

import useStore, { MediaData, MediaType } from 'state';

import { HeaderContainer, List, ListItem, Nav, H2, NavContainer } from './styled';


const Header: React.VFC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState({
    L: false,
    R: false,
  });
  const location = useLocation();
  const match = useRouteMatch();
  const state = useStore();

  React.useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen({
        L: false,
        R: false,
      });
    }
  }, [location.pathname]);

  function onMouseEnter(type: MediaType, media: MediaData) {
    if (window.location.pathname === '/') {
      state.setMedia(type, media);
    }
  }

  function onMouseEnterList() {
    state.setSideFullscreen(true);
  }

  function onMouseLeaveList() {
    state.setSideFullscreen(false);

    if (window.location.pathname !== '/') {
      setIsMenuOpen({
        L: false,
        R: false,
      });
    }
  }

  function onMouseEnterNav(tag: 'container' | 'title', side: 'L' | 'R') {
    if (tag === 'title' || (tag === 'container' && window.location.pathname === '/')) {
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
            {mediaDb.photos.map((photo) => (
              <ListItem
                key={photo.id}
                onMouseEnter={() => onMouseEnter('photo', photo)}
              >
                <Link to={`${match.path}${photo.slug}`}>
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
            {mediaDb.videos.map((video) => (
              <ListItem
                key={video.id}
                onMouseEnter={() => onMouseEnter('video', video)}
              >
                <Link to={`${match.path}${video.slug}`}>
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
