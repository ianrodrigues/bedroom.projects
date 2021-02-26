import React from 'react';
import mediaDb from 'services/mediaDB';

import useStore, { MediaData, MediaType } from 'state';

import { HeaderContainer, List, ListItem, Nav } from './styled';


const Header: React.VFC = () => {
  const state = useStore();

  function onMouseEnter(type: MediaType, media: MediaData) {
    state.setMedia(type, media);
  }

  return (
    <HeaderContainer>
      <Nav>
        <List>
          <ListItem>Photos</ListItem>
          {mediaDb.photos.map((photo) => (
            <ListItem
              key={photo.title}
              onMouseEnter={() => onMouseEnter('photo', photo)}
            >
              {photo.title}
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem>Videos</ListItem>
          {mediaDb.videos.map((video) => (
            <ListItem
              key={video.title}
              onMouseEnter={() => onMouseEnter('video', video)}
            >
              {video.title}
            </ListItem>
          ))}
        </List>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
