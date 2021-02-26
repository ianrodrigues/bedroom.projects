import React from 'react';
import mediaDb from 'services/mediaDB';

import useStore, { MediaData, MediaType } from 'state';

import { HeaderContainer, List, ListItem, Nav, H2, NavContainer } from './styled';


const Header: React.VFC = () => {
  const state = useStore();

  function onMouseEnter(type: MediaType, media: MediaData) {
    state.setMedia(type, media);
  }

  return (
    <HeaderContainer>
      <Nav>
        <NavContainer>
          <H2>Photo</H2>
          <List
            onMouseEnter={() => state.setSideFullscreen('L')}
            onMouseLeave={() => state.setSideFullscreen(null)}
          >
            {mediaDb.photos.map((photo) => (
              <ListItem
                key={photo.title}
                onMouseEnter={() => onMouseEnter('photo', photo)}
              >
                {photo.title}
              </ListItem>
            ))}
          </List>
        </NavContainer>

        <NavContainer>
          <H2>Film</H2>
          <List
            onMouseEnter={() => state.setSideFullscreen('R')}
            onMouseLeave={() => state.setSideFullscreen(null)}
          >
            {mediaDb.videos.map((video) => (
              <ListItem
                key={video.title}
                onMouseEnter={() => onMouseEnter('video', video)}
              >
                {video.title}
              </ListItem>
            ))}
          </List>
        </NavContainer>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
