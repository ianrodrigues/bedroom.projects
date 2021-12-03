import * as i from 'types';
import React from 'react';
import shallow from 'zustand/shallow';

import useStore, { selectors } from 'state';

import { LoaderContainer, LoaderInner } from './styled';


const Loader: React.VFC = () => {
  const { loading: appLoading } = useStore(selectors.ui, shallow);
  const [visible, setVisible] = React.useState(true);
  const [loadType, setLoadType] = React.useState<i.GlobalLoadingState>('site');

  React.useEffect(() => {
    if (!appLoading) {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    } else {
      setLoadType(appLoading);
      setVisible(true);
    }
  }, [appLoading]);

  return (
    <LoaderContainer $visible={visible} $type={loadType}>
      <LoaderInner done={!appLoading} />
    </LoaderContainer>
  );
};

export default Loader;
