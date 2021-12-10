import * as i from 'types';
import React from 'react';

import { useShallowStore } from 'hooks';

import { LoaderContainer, LoaderInner } from './styled';


const Loader: React.VFC = () => {
  const ui = useShallowStore('ui', ['loading']);
  const [visible, setVisible] = React.useState(true);
  const [loadType, setLoadType] = React.useState<i.GlobalLoadingState>('site');

  React.useEffect(() => {
    if (!ui.loading) {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    } else {
      setLoadType(ui.loading);
      setVisible(true);
    }
  }, [ui.loading]);

  return (
    <LoaderContainer $visible={visible} $type={loadType}>
      <LoaderInner done={!ui.loading} />
    </LoaderContainer>
  );
};

export default Loader;
