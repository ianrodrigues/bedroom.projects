import * as i from 'types';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';
import { useQuery } from 'hooks';

import MediaTitle from 'common/typography/MediaTitle';
import { DetailContainer } from 'common/presentation/DetailPage';
import { getMediaObjectBySlug } from 'state/utils';

import Player from './components/Player';
import { DescriptionContainer, DetailPlayerContainer, DetailPlayerOverlay, VideoPoster, NextContainer, VideoDetailContainer } from './styled';


const loadAmt = 2; // Video poster & video canplay event
let loaded = 0;
let scroller: VirtualScroll;

export type GoingNext = false | 'starting' | 'transition';

const VideoDetail: React.VFC = () => {
  const state = useStore();
  const history = useHistory();
  const queries = useQuery();
  const params = useParams<i.DetailPageParams>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const [detail, setDetail] = React.useState(getMediaObjectBySlug(params.slug, 'video'));
  const [isGoingNext, setGoingNext] = React.useState<GoingNext>(false);

  // Initialise
  React.useEffect(() => {
    if (!detail) {
      setDetail(getMediaObjectBySlug(params.slug, 'video'));
    }
  }, [state.allMedia]);

  React.useEffect(() => {
    if (detail) {
      if (state.loading === false) {
        state.setLoading('page');
      }

      const img = document.createElement('img');
      img.onload = handleLoad;
      img.src = CMS_URL + detail.video_poster.url;

      const vid = document.createElement('video');
      vid.oncanplay = handleLoad;
      vid.src = CMS_URL + detail.full_video!.url;
    }

    return function cleanup() {
      loaded = 0;
      state.setLoading(false);
    };
  }, [detail]);

  React.useEffect(() => {
    setDetail(getMediaObjectBySlug(params.slug, 'video'));
    setGoingNext(false);

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
      mouseMultiplier: 1,
    });

    scroller.on((scroll) => {
      if (scroll.y > 0) {
        scroll.y = 0;
        scroller.__private_3_event.y = 0;
      }

      // Lock scrolling
      if (isGoingNext) {
        return;
      }

      if (containerRef.current) {
        const containerBounds = containerRef.current.getBoundingClientRect();
        const VIDEO_BOTTOM_PADDING = 50;
        const bottomEdge = containerBounds.height - window.innerHeight + VIDEO_BOTTOM_PADDING;

        if (Math.abs(scroll.y) >= bottomEdge) {
          scroll.y = -bottomEdge;
          scroller.__private_3_event.y = -bottomEdge;

          containerRef.current.style.transform = `translate3d(0px, ${scroll.y}px, 0px)`;

          setGoingNext('starting');

          setTimeout(() => {
            setGoingNext('transition');
          }, 600);

          setTimeout(() => {
            history.push(`/film/${detail?.next.slug}?next=1`);
          }, 1300);

          return;
        }

        containerRef.current.style.transform = `translate3d(0px, ${scroll.y}px, 0px)`;

        if (titleRef.current) {
          const containerBounds = containerRef.current.getBoundingClientRect();
          const titleBounds = titleRef.current.getBoundingClientRect();
          const TOP_BOTTOM_PADDING = 100 * 2;
          const titleDistance = window.innerHeight - TOP_BOTTOM_PADDING;
          const y = (Math.abs(scroll.y) / (containerBounds.height - window.innerHeight)) * titleDistance;

          if (y < titleDistance - titleBounds.height) {
            titleRef.current.style.transform = `translate3d(0px, -${y}px, 0px)`;
          }
        }
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, [containerRef, isGoingNext, detail]);

  function handleLoad() {
    loaded++;

    if (loaded >= loadAmt) {
      state.setLoading(false);
    }
  }

  if (state.loading) {
    return null;
  }

  return (
    <VideoDetailContainer isNext={isGoingNext}>
      <DetailContainer ref={containerRef}>
        <DetailPlayerContainer isReady={state.videoPlayer.isReady} isNext={queries.has('next')}>
          {detail && (
            <>
              <VideoPoster $src={CMS_URL + detail.video_poster?.url} />
              <Player videoObject={detail} />
              <DetailPlayerOverlay />
            </>
          )}
        </DetailPlayerContainer>

        <DescriptionContainer>
          <div>{detail?.description}</div>
          <div>{detail?.credits}</div>
        </DescriptionContainer>

        <NextContainer isGoingNext={isGoingNext}>
          <DetailPlayerContainer>
            {(detail?.next && (
              <>
                <VideoPoster $src={CMS_URL + detail.next.video_poster?.url} />
                <DetailPlayerOverlay />
              </>
            ))}
          </DetailPlayerContainer>

          <MediaTitle side="R" visible={!state.isAnyMenuOpen()}>
            {detail?.next.title}
          </MediaTitle>
        </NextContainer>
      </DetailContainer>

      <MediaTitle
        ref={titleRef}
        side="R"
        visible={!state.isAnyMenuOpen() && !state.videoPlayer.isPlaying && !isGoingNext}
        autoHide
      >
        {detail?.title}
      </MediaTitle>
    </VideoDetailContainer>
  );
};

export default VideoDetail;
