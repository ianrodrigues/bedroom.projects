import * as i from 'types';
import React from 'react';

import { MediaTitleContainer, MediaTitleInner, Title } from './styled';


const MediaTitle = React.forwardRef<HTMLHeadingElement, Props>((props, ref) => {
  return (
    <MediaTitleContainer>
      <MediaTitleInner>
        <Title ref={ref} show={props.visible} side={props.side}>
          {props.children}
        </Title>
      </MediaTitleInner>
    </MediaTitleContainer>
  );
});

export type Props = {
  side: i.Side;
  children?: string;
  visible: boolean;
};

export default MediaTitle;
