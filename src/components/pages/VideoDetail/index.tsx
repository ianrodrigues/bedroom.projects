import * as i from 'types';
import React from 'react';
import { useHistory, useParams } from 'react-router';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';
import { useQuery } from 'hooks';
import { SmoothScroll } from 'services';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

import MediaTitle from 'common/typography/MediaTitle';
import SEO from 'common/SEO';
import { DetailContainer } from 'common/presentation/DetailPage';

import Player from './components/Player';
import {
  DescriptionContainer, DetailPlayerContainer, DetailPlayerOverlay, VideoPoster, NextContainer,
  VideoDetailContainer,
} from './styled';


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
  const [nextDetail, setNextDetail] = React.useState(getMediaObjectBySlug(detail?.next || '', 'video'));
  const [isGoingNext, setGoingNext] = React.useState<GoingNext>(false);
  const loader = React.useContext(AssetsLoaderContext);
  const [pageAssetsLoaded, setPageAssetsLoaded] = React.useState(0);

  React.useEffect(() => {
    return function cleanup() {
      state.ui.setLoading(false);
    };
  }, []);

  // Initialise
  React.useEffect(() => {
    if (!detail) {
      setDetail(getMediaObjectBySlug(params.slug, 'video'));
    }
  }, [state.media.allMedia]);

  React.useEffect(() => {
    if (pageAssetsLoaded === 3) {
      state.ui.setLoading(false);
    }
  }, [pageAssetsLoaded]);

  React.useEffect(() => {
    if (detail) {
      setNextDetail(getMediaObjectBySlug(detail.next, 'video'));

      if (state.ui.loading === false) {
        state.ui.setLoading('page');
      }

      // Current video + poster
      loader
        ?.addVideoAsset((video) => {
          video.src = CMS_URL + detail.full_video!.url;
        })
        .then(assetLoaded);

      loader
        ?.addImageAsset((img) => {
          img.src = CMS_URL + detail.video_poster.url;
        })
        .then(assetLoaded);
    }
  }, [detail]);

  React.useEffect(() => {
    if (nextDetail) {
      // Next video poster
      loader
        ?.addImageAsset((img) => {
          img.src = CMS_URL + nextDetail.video_poster?.url;
        })
        .then(assetLoaded);
    }
  }, [nextDetail]);

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
  }, [params.slug, state.media.allMedia?.video]);

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
          setPageAssetsLoaded(0);

          if (state.ui.loading === false) {
            state.ui.setLoading('page');
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
            history.push(`/film/${detail?.next}?next=1`);
          }, 2500);
        }
      }
    });

    return function cleanup() {
      scroller?.destroy();
    };
  }, [detail, isGoingNext, state.videoPlayer.isPlaying]);

  function assetLoaded() {
    setPageAssetsLoaded((num) => num + 1);
  }

  return (
    <VideoDetailContainer isNext={isGoingNext}>
      <SEO
        pageTitle={detail?.title}
        ogDescription={detail?.title}
        ogImg={CMS_URL + detail?.video_poster?.formats.medium?.url}
      />
      <DetailContainer id="film-container" ref={containerRef}>
        <div ref={bodyRef} id="film-container__body">
          <DetailPlayerContainer
            isReady={loader.allLoaded && state.videoPlayer.isReady}
            isNext={queries.has('next')}
          >
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

        {nextDetail && (
          <NextContainer id="next-container" isGoingNext={isGoingNext}>
            <DetailPlayerContainer ref={nextVideoRef} data-scroll>
              <>
                <VideoPoster $src={CMS_URL + nextDetail.video_poster?.url} />
                <DetailPlayerOverlay />
              </>
            </DetailPlayerContainer>

            <MediaTitle
              ref={nextTitleRef}
              side="R"
              visible={!state.ui.isAnyMenuOpen()}
              dataset={{ 'data-scroll': true }}
            >
              {nextDetail.title}
            </MediaTitle>
          </NextContainer>
        )}
      </DetailContainer>
      <div id="film-container--hitbox" />
      <MediaTitle
        ref={titleRef}
        side="R"
        visible={!state.ui.isAnyMenuOpen() && !state.videoPlayer.isPlaying && !isGoingNext}
        autoHide
        dataset={{ 'data-scroll': true }}
      >
        {isGoingNext === 'ending' ? nextDetail?.title || '' : detail?.title || ''}
      </MediaTitle>
    </VideoDetailContainer>
  );
};

export default VideoDetail;
