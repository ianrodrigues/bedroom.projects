import React from 'react';

import useStore from 'state';


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePageAssetLoadCounter() {
  const state = useStore();
  const [amount, setAmount] = React.useState(0);
  const [loaded, setLoaded] = React.useState(0);

  React.useEffect(() => {
    return function cleanup() {
      state.ui.setLoading(false);
      reset();
    };
  }, []);

  function addLoaded() {
    setLoaded((num) => num + 1);
  }

  function reset() {
    setAmount(0);
    setLoaded(0);
  }

  return {
    loaded,
    addLoaded,
    setAmount,
    reset,
    done: loaded >= amount,
  };
}
