import * as i from 'types';
import React from 'react';
import { useMatch, useNavigate, useSearch } from 'react-location';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';
import { usePageAssetLoadCounter } from 'hooks';
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
  const navigate = useNavigate();
  const search = useSearch<i.DetailPageGenerics>();
  const { params } = useMatch<i.DetailPageGenerics>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const nextVideoRef = React.useRef<HTMLDivElement>(null);
  const nextTitleRef = React.useRef<HTMLHeadingElement>(null);
  const [detail, setDetail] = React.useState(getMediaObjectBySlug(params.slug, 'video'));
  const [nextDetail, setNextDetail] = React.useState(getMediaObjectBySlug(detail?.next || '', 'video'));
  const [isGoingNext, setGoingNext] = React.useState<GoingNext>(false);
  const loader = React.useContext(AssetsLoaderContext);
  const assetLoadCounter = usePageAssetLoadCounter();

  React.useEffect(() => {
    return function cleanup() {
      state.ui.setLoading(false);
      scroller?.destroy();
    };
  }, []);

  // Initialise
  React.useEffect(() => {
    if (!detail) {
      setDetail(getMediaObjectBySlug(params.slug, 'video'));
    }
  }, [state.media.allMedia]);

  React.useEffect(() => {
    if (assetLoadCounter.loaded === 3) {
      if (__DEV__) {
        console.info('page loaded');
      }

      state.ui.setLoading(false);
    }
  }, [assetLoadCounter.loaded]);

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
        .then(assetLoadCounter.addLoaded);

      loader
        ?.addImageAsset((img) => {
          img.src = CMS_URL + detail.video_poster.url;
        })
        .then(assetLoadCounter.addLoaded);
    }
  }, [detail]);

  React.useEffect(() => {
    if (nextDetail) {
      // Next video poster
      loader
        ?.addImageAsset((img) => {
          img.src = CMS_URL + nextDetail.video_poster?.url;
        })
        .then(assetLoadCounter.addLoaded);
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
  }, [params.slug]);

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
          assetLoadCounter.reset();

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
            navigate({
              to: `/film/${detail?.next}`,
              search: {
                next: 1,
              },
            });
          }, 2500);
        }
      }
    });
  }, [detail, isGoingNext, state.videoPlayer.isPlaying]);

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
            isReady={loader?.allLoaded && state.videoPlayer.isReady}
            isNext={!!search.next}
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
