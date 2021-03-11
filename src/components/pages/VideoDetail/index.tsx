import * as i from 'types';
import React from 'react';
import { useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';

import MediaTitle from 'common/typography/MediaTitle';
import { DetailContainer } from 'common/presentation/DetailPage';
import { getMediaObjectBySlug } from 'state/utils';

import Player from './components/Player';
import { DescriptionContainer, DetailPlayerContainer, DetailPlayerOverlay, VideoPoster } from './styled';


let scroller: VirtualScroll;


const VideoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<i.DetailPageParams>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const [detail, setDetail] = React.useState<i.CurNextDetails<'video'>>({
    cur: getMediaObjectBySlug(params.slug, 'video'),
    next: undefined,
  });

  React.useEffect(() => {
    setDetail({
      cur: getMediaObjectBySlug(params.slug, 'video'),
      next: undefined,
    });

    if (scroller) {
      scroller.__private_3_event.y = 0;
    }

    if (containerRef.current) {
      containerRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
    }
    if (titleRef.current) {
      titleRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
    }
  }, [params.slug, state.allMedia?.video]);

  React.useEffect(() => {
    scroller = new VirtualScroll({
      mouseMultiplier: .3,
    });

    scroller.on((scroll) => {
      if (scroll.y > 0) {
        scroll.y = 0;
        scroller.__private_3_event.y = 0;
      }

      if (scroll.y === 0) {
        scroll.y = scroll.deltaY;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(0px, ${scroll.y}px, 0px)`;

        if (titleRef.current) {
          const containerBounds = containerRef.current.getBoundingClientRect();
          const titleBounds = titleRef.current.getBoundingClientRect();
          const titleDistance = window.innerHeight - titleBounds.height + 30;
          const y = (Math.abs(scroll.y) / containerBounds.height) * titleDistance;

          if (y < titleDistance - titleBounds.height) {
            titleRef.current.style.transform = `translate3d(0px, -${y}px, 0px)`;
          }
        }
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, [containerRef]);

  return (
    <>
      <DetailContainer ref={containerRef}>
        <DetailPlayerContainer isReady={state.videoPlayer.isReady}>
          {(detail.cur && (
            <>
              <VideoPoster src={CMS_URL + detail.cur.video_poster?.url} />
              <Player videoObject={detail.cur} />
              <DetailPlayerOverlay />
            </>
          ))}
        </DetailPlayerContainer>
        <DescriptionContainer>
          <div>{detail.cur?.description}</div>
          <div>{detail.cur?.credits}</div>
        </DescriptionContainer>
        <div>next piece</div>
      </DetailContainer>
      <MediaTitle
        ref={titleRef}
        side="R"
        visible={!state.isAnyMenuOpen() && !state.videoPlayer.isPlaying}
      >
        {detail.cur?.title}
      </MediaTitle>
    </>
  );
};

export default VideoDetail;
