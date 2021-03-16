import React from 'react';

import useStore from 'state';

import { LoaderContainer, LoaderInner } from './styled';


const Loader: React.VFC = () => {
  const state = useStore();
  const [visible, setVisible] = React.useState(true);
  const [loadType, setLoadType] = React.useState<'site' | 'page'>('site');

  React.useEffect(() => {
    if (!state.loading) {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    } else {
      setLoadType(state.loading);
      setVisible(true);
    }
  }, [state.loading]);

  return (
    <LoaderContainer visible={visible} $type={loadType}>
      <LoaderInner done={!state.loading} />
    </LoaderContainer>
  );
};

export default Loader;
