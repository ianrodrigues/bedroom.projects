import * as i from 'types';
import React from 'react';

import { MediaTitleContainer, MediaTitleInner, Title } from './styled';


let timeoutId = -1;

const MediaTitle = React.forwardRef<HTMLHeadingElement, Props>((props, ref) => {
  const [show, setShow] = React.useState(true);

  function handleAutoHide() {
    if (!props.autoHide) {
      return;
    }

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      setShow(false);
    }, 5000);
  }

  function handleMouseMove() {
    setShow(true);
    handleAutoHide();
  }

  React.useEffect(() => {
    handleAutoHide();

    if (props.autoHide) {
      document.addEventListener('wheel', handleMouseMove);
    }

    return function cleanup() {
      document.removeEventListener('wheel', handleMouseMove);
    };
  }, []);

  React.useEffect(() => {
    if (props.visible) {
      setShow(true);
      handleAutoHide();
    }
  }, [props.visible]);

  return (
    <MediaTitleContainer>
      <MediaTitleInner>
        <Title ref={ref} show={show && props.visible} side={props.side} {...props.dataset}>
          {props.children}
        </Title>
      </MediaTitleInner>
    </MediaTitleContainer>
  );
});

export type Props = {
  side: i.Side;
  visible: boolean;
  autoHide?: boolean;
  children?: string;
  dataset?: Record<string, true>;
};

export default MediaTitle;
