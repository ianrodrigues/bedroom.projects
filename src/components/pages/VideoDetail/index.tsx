import * as i from 'types';
import React from 'react';
import { useHistory, useParams } from 'react-router';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';
import { useQuery } from 'hooks';
import { SmoothScroll } from 'services';

import MediaTitle from 'common/typography/MediaTitle';
import { DetailContainer } from 'common/presentation/DetailPage';

import Player from './components/Player';
import {
  DescriptionContainer, DetailPlayerContainer, DetailPlayerOverlay, VideoPoster, NextContainer,
  VideoDetailContainer,
} from './styled';


const loadAmt = 2; // Video poster & video canplay event
let loaded = 0;
let scroller: SmoothScroll | undefined;

export type GoingNext = false | 'starting' | 'ending';

const VideoDetail: React.VFC = () => {
  const state = useStore();
  const history = useHistory();
  const queries = useQuery();
  const params = useParams<i.DetailPageParams>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const nextVideoRef = React.useRef<HTMLDivElement>(null);
  const nextTitleRef = React.useRef<HTMLHeadingElement>(null);
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
    const bodyEl = bodyRef.current;
    if (bodyEl) {
      bodyEl.style.transition = 'none';
    }

    window.scrollTo(0, 0);

    setTimeout(() => {
      setDetail(getMediaObjectBySlug(params.slug, 'video'));
      setGoingNext(false);

      if (titleRef.current) {
        titleRef.current.style.removeProperty('opacity');
      }
    }, 200);
  }, [params.slug, state.allMedia?.video]);

  React.useEffect(() => {
    scroller = new SmoothScroll('#film-container');

    scroller.on((scrollY, bodyEl, bottomEdge) => {
      if (nextVideoRef.current) {
        nextVideoRef.current.style.transform = `translate3d(0, ${-scrollY}px, 0)`;
      }

      if (state.videoPlayer.isPlaying && scrollY >= window.innerHeight * .75) {
        state.videoPlayer.setPlaying(false);
      }

      if (titleRef.current) {
        const PADDING = 200;
        const topEdge = window.innerHeight - PADDING - titleRef.current.offsetHeight;
        const bodyHeight = bodyEl.offsetHeight - window.innerHeight;
        const y = (scrollY / bodyHeight) * topEdge;

        if (y < topEdge) {
          titleRef.current.style.transform = `translate3d(0, ${-y}px, 0)`;
        } else {
          titleRef.current.style.transform = `translate3d(0, ${-topEdge}px, 0)`;
        }

        if (!titleRef.current.style.transition.includes('opacity')) {
          titleRef.current.style.transition = titleRef.current.style.transition + ', opacity 300ms';
        }
      }


      if (nextTitleRef.current) {
        const PADDING = 200 - 50;
        const nextTitleEdge = bottomEdge - window.innerHeight + PADDING;

        nextTitleRef.current.style.transform = `translate3d(0, ${-scrollY}px, 0)`;

        if (scrollY < nextTitleEdge) {
          if (nextTitleRef.current.style.display !== 'block') {
            nextTitleRef.current.style.display = 'block';
          }

          nextTitleRef.current.style.transform = `translate3d(0, ${-scrollY}px, 0)`;
        } else {
          nextTitleRef.current.style.transform = `translate3d(0, ${-nextTitleEdge}px, 0)`;
        }
      }

      if (!isGoingNext) {
        if (Math.abs(scrollY) >= bottomEdge) {
          window.scrollTo(0, bottomEdge);

          if (nextVideoRef.current) {
            nextVideoRef.current.style.transform = `translate3d(0, ${-bottomEdge}px, 0)`;
          }

          setGoingNext('starting');

          if (state.loading === false) {
            state.setLoading('page');
          }

          // Fade out current title
          if (titleRef.current) {
            titleRef.current.style.opacity = '0';
          }

          setTimeout(() => {
            setGoingNext('ending');

            if (titleRef.current) {
              titleRef.current.style.transition = 'none';
              titleRef.current.style.opacity = '1';
              titleRef.current.style.transform = 'translate3d(0, 0, 0)';
            }

            if (nextTitleRef.current) {
              nextTitleRef.current.style.transition = 'none';
              nextTitleRef.current.style.transform = 'translate3d(0, 0, 0)';
            }
          }, 2100);

          setTimeout(() => {
            history.push(`/film/${detail?.next.slug}?next=1`);
          }, 2500);
        }
      }
    });

    return function cleanup() {
      scroller?.destroy();
    };
  }, [detail, isGoingNext, state.videoPlayer.isPlaying]);

  function handleLoad() {
    loaded++;

    if (loaded >= loadAmt) {
      state.setLoading(false);
    }
  }

  return (
    <VideoDetailContainer isNext={isGoingNext}>
      <DetailContainer id="film-container" ref={containerRef}>
        <div ref={bodyRef} id="film-container__body">
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
            <div dangerouslySetInnerHTML={{ __html: detail?.description || '' }} />
            <div dangerouslySetInnerHTML={{ __html: detail?.credits || '' }} />
          </DescriptionContainer>
        </div>

        <NextContainer id="next-container" isGoingNext={isGoingNext}>
          <DetailPlayerContainer ref={nextVideoRef} data-scroll>
            {(detail?.next && (
              <>
                <VideoPoster $src={CMS_URL + detail.next.video_poster?.url} />
                <DetailPlayerOverlay />
              </>
            ))}
          </DetailPlayerContainer>

          <MediaTitle
            ref={nextTitleRef}
            side="R"
            visible={!state.isAnyMenuOpen()}
            dataset={{ 'data-scroll': true }}
          >
            {detail?.next.title}
          </MediaTitle>
        </NextContainer>
      </DetailContainer>
      <div id="film-container--hitbox" />
      <MediaTitle
        ref={titleRef}
        side="R"
        visible={!state.isAnyMenuOpen() && !state.videoPlayer.isPlaying && !isGoingNext}
        autoHide
        dataset={{ 'data-scroll': true }}
      >
        {isGoingNext === 'ending' ? detail?.next.title : detail?.title}
      </MediaTitle>
    </VideoDetailContainer>
  );
};

export default VideoDetail;
