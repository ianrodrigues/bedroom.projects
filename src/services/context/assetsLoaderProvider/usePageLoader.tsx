import React from 'react';


function usePageLoader() {
  const [amount, setAmount] = React.useState(0);
  const [loaded, setLoaded] = React.useState(0);

  React.useEffect(() => {
    return function cleanup() {
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

export default usePageLoader;
