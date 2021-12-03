import React from 'react';
import shallow from 'zustand/shallow';

import useStore, { selectors } from 'state';


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePageAssetLoadCounter() {
  const { setLoading: setAppLoading } = useStore(selectors.ui, shallow);
  const [amount, setAmount] = React.useState(0);
  const [loaded, setLoaded] = React.useState(0);

  React.useEffect(() => {
    return function cleanup() {
      setAppLoading(false);
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
