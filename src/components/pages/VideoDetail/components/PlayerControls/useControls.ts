import React from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useControls() {
  const [started, setStarted] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0);

  return {
    started, setStarted,
    playing, setPlaying,
    volume, setVolume,
  };
}

export default useControls;
