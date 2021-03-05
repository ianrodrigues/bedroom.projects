import * as i from 'types';
import React from 'react';
import { useParams } from 'react-router';

import useStore from 'state';

import { DetailContainer } from 'common/presentation/DetailPage';
import { getMediaObjectBySlug } from 'state/utils';

import Player from './components/Player';


const VideoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<i.DetailPageParams>();
  const [videoObject, setVideoObject] = React.useState(getMediaObjectBySlug(params.slug, 'video'));

  React.useEffect(() => {
    setVideoObject(getMediaObjectBySlug(params.slug, 'video'));
  }, [params.slug, state.allMedia?.video]);

  return (
    <DetailContainer>
      {videoObject && <Player videoObject={videoObject} />}
      <div>credits/description</div>
      <div>next video</div>
    </DetailContainer>
  );
};

export default VideoDetail;
