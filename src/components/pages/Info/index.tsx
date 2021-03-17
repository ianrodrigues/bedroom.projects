import * as i from 'types';
import React from 'react';
import { useQuery } from 'react-query';
import Showdown from 'showdown';

import useStore from 'state';

import MediaTitle from 'common/typography/MediaTitle';

import { InfoContainer, InfoDescription, InfoFigure } from './styled';


const Info: React.VFC = () => {
  const state = useStore();
  const [visible, setVisible] = React.useState(false);
  const { isLoading, data } = useQuery<i.APIInfoObject, Error>('info', () =>
    fetch(CMS_URL + '/bedroom-infos/1')
      .then((res) => res.json())
      .then((data: i.APIInfoObject) => {
        const converter = new Showdown.Converter();
        const html = converter.makeHtml(data.description);
        const newData: i.APIInfoObject = {
          ...data,
          description: html,
        };

        return newData;
      }),
  );

  React.useEffect(() => {
    if (!data && !state.loading) {
      state.setLoading('page');
    }
  }, [data]);

  React.useEffect(() => {
    if (!isLoading) {
      state.setLoading(false);

      setTimeout(() => {
        setVisible(true);
      }, 500);
    }
  }, [isLoading]);

  if (!data && state.loading) {
    return null;
  }

  return (
    <InfoContainer $visible={visible}>
      <InfoDescription dangerouslySetInnerHTML={{ __html: data!.description }} />

      <InfoFigure>
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        <img src={CMS_URL + data?.image.url} alt={data?.image.alternativeText} />
      </InfoFigure>

      <MediaTitle side="R" visible>SOREN HARRISON & AMIR HOSSAIN</MediaTitle>
    </InfoContainer>
  );
};

export default Info;
