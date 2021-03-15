import React from 'react';

import { VolumeBar, VolumeContainer } from './styled';

const NUM_BARS = 5;

const Volume: React.VFC<Props> = (props) => {
  const [volume, setVolume] = React.useState(props.videoRef?.current?.volume ?? 0);
  const containerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!props.videoRef?.current) {
      return;
    }

    props.videoRef.current.addEventListener('volumechange', handleVolumeChange);

    return function cleanup() {
      props.videoRef?.current?.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [props.videoRef]);

  function handleVolumeChange(this: HTMLVideoElement) {
    setVolume(this.volume);
  }

  function handleClick(e: React.MouseEvent) {
    if (!containerRef.current || !props.videoRef?.current) {
      return;
    }

    const bounds = containerRef.current.getBoundingClientRect();
    const { left, width } = bounds;
    const clickX = e.pageX - left;
    const prct = clickX / width;

    props.videoRef.current.volume = prct;
  }

  return (
    <VolumeContainer ref={containerRef} onClick={handleClick} visible={props.visible}>
      {Array.from({ length: NUM_BARS }).map((_, i) => (
        <VolumeBar key={i} active={volume * NUM_BARS >= i} />
      ))}
    </VolumeContainer>
  );
};

export type Props = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  visible?: boolean;
};

export default Volume;
