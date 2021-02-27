import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import mediaDb from 'services/mediaDB';

import useStore, { MediaData, MediaType } from 'state';

import { HeaderContainer, List, ListItem, Nav, H2, NavContainer } from './styled';


const Header: React.VFC = () => {
  const match = useRouteMatch();
  const state = useStore();

  function onMouseEnter(type: MediaType, media: MediaData) {
    state.setMedia(type, media);
  }

  function setFullscreen() {
    state.setSideFullscreen(true);
  }

  function setNotFullscreen() {
    state.setSideFullscreen(false);
  }

  return (
    <HeaderContainer>
      <Nav>
        <NavContainer>
          <H2>Photo</H2>
          <List onMouseEnter={setFullscreen} onMouseLeave={setNotFullscreen}>
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

        <NavContainer>
          <H2>Film</H2>
          <List onMouseEnter={setFullscreen} onMouseLeave={setNotFullscreen}>
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
