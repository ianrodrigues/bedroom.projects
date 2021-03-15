import React from 'react';

import useStore from 'state';

import { LoaderContainer, LoaderInner } from './styled';


const Loader: React.VFC = () => {
  const state = useStore();
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (!state.loading) {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [state.loading]);

  return (
    <LoaderContainer visible={visible}>
      <LoaderInner done={!state.loading} />
    </LoaderContainer>
  );
};

export default Loader;
