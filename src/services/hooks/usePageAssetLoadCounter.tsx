import React from 'react';

import { useShallowStore } from './useShallowStore';


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePageAssetLoadCounter() {
  const ui = useShallowStore('ui', ['setLoading']);
  const [amount, setAmount] = React.useState(0);
  const [loaded, setLoaded] = React.useState(0);

  React.useEffect(() => {
    return function cleanup() {
      ui.setLoading(false);
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
    done: amount > 0 && loaded >= amount,
  };
}
