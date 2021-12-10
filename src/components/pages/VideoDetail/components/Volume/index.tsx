import React from 'react';

import { useShallowStore } from 'hooks';

import { VolumeBar, VolumeContainer } from './styled';


const NUM_BARS = 5;

const Volume: React.VFC<Props> = (props) => {
  const ui = useShallowStore('ui', ['interacted']);
  const [volume, setVolume] = React.useState(ui.interacted ? .3 : 0);
  const containerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!props.videoRef?.current) {
      return;
    }

    props.videoRef.current.volume = volume;
    props.videoRef?.current.addEventListener('volumechange', handleVolumeChange);

    return function cleanup() {
      props.videoRef?.current?.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [props.videoRef?.current]);

  function handleVolumeChange(this: HTMLVideoElement) {
    setVolume(this.volume);
  }

  function handleClick(e: React.MouseEvent) {
    if (!containerRef.current || !props.videoRef?.current) {
      return;
    }

    const bounds = containerRef.current.getBoundingClientRect();
    const clickX = e.pageX - bounds.left;
    const prct = clickX / bounds.width;

    props.videoRef.current.volume = prct;
    props.videoRef.current.muted = false;
  }

  return (
    <VolumeContainer ref={containerRef} onClick={handleClick} visible={props.visible}>
      {Array.from({ length: NUM_BARS }).map((_, i) => (
        <VolumeBar key={i} active={volume * NUM_BARS >= i} />
      ))}
    </VolumeContainer>
  );
};

export interface Props {
  videoRef?: React.RefObject<HTMLVideoElement>;
  visible?: boolean;
}

export default Volume;
