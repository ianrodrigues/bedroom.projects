import React from 'react';

import useControls from '../Player/useControls';

import { PlayerControlsContainer } from './styled';


const PlayerControls: React.FC<Props> = (props) => {
  const controls = useControls();

  return (
    <PlayerControlsContainer $width={props.width} $height={props.height}>
      {React.cloneElement(props.children, { controls })}
    </PlayerControlsContainer>
  );
};

export type Props = {
  width?: number;
  height?: number;
  children: React.ReactElement;
};

export default PlayerControls;
