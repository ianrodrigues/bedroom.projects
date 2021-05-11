import * as i from 'types';
import React from 'react';

import useStore from 'state';

import { LoaderContainer, LoaderInner } from './styled';


const Loader: React.VFC = () => {
  const state = useStore();
  const [visible, setVisible] = React.useState(true);
  const [loadType, setLoadType] = React.useState<i.GlobalLoadingState>('site');

  React.useEffect(() => {
    if (!state.ui.loading) {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    } else {
      setLoadType(state.ui.loading);
      setVisible(true);
    }
  }, [state.ui.loading]);

  return (
    <LoaderContainer $visible={visible} $type={loadType}>
      <LoaderInner done={!state.ui.loading} />
    </LoaderContainer>
  );
};

export default Loader;
