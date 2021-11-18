import * as i from 'types';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';
import { useQuery } from 'hooks';
import { SmoothScroll } from 'services';
import { AssetsLoaderContext } from 'context/assetsLoaderProvider';

import MediaTitle from 'common/typography/MediaTitle';
import SEO from 'common/SEO';
import { DetailContainer } from 'common/presentation/DetailPage';

import RowImg from './components/RowImg';
import { PhotoDetailContainer, FullContentContainer, NextContainer, Row } from './styled';


let scroller: SmoothScroll | undefined;
let observers: IntersectionObserver[] = [];

interface Sections {
  head?: i.Layout;
  body: i.Layout[];
}

type GoingNextPhases = false | 'starting' | 'ending';

const PhotoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<i.DetailPageParams>();
  const history = useHistory();
  const location = useLocation();
  const queries = useQuery();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const nextTitleRef = React.useRef<HTMLHeadingElement>(null);
  const nextImageRef = React.useRef<HTMLDivElement>(null);
  const [sections, setSections] = React.useState<Sections>({
    head: undefined,
    body: [],
  });
  const [detail, setDetail] = React.useState<i.StatePhotoObject | undefined>(
    getMediaObjectBySlug(params.slug, 'photo'),
  );
  const [nextDetail, setNextDetail] = React.useState<i.StatePhotoObject | undefined>(
    getMediaObjectBySlug(detail?.next || '', 'photo'),
  );
  const [isGoingNext, setGoingNext] = React.useState<GoingNextPhases>(
    queries.has('next') ? 'ending' : false,
  );
  const loader = React.useContext(AssetsLoaderContext);

  React.useEffect(() => {
    return function cleanup() {
      loader?.pageLoader.reset();
    };
  }, []);

  // Initialise
  React.useEffect(() => {
    if (!detail) {
      setDetail(getMediaObjectBySlug(params.slug, 'photo'));
    }
  }, [state.media.allMedia]);

  React.useEffect(() => {
    if (detail) {
      if (loader?.pageLoader.loaded === detail.bedroom_media_layouts.length) {
        if (__DEV__) {
          console.info('page loaded');
        }

        state.ui.setLoading(false);
      }
    }
  }, [loader?.pageLoader.loaded, detail]);

  // Route change transition/reset
  React.useEffect(() => {
    for (const observer of observers) {
      observer.disconnect();
    }

    observers = [];

    window.scrollTo(0, 0);

    // Necessary for transitions between clicking photos pages
    if (!isGoingNext) {
      setSections({ head: undefined, body: [] });
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.transition = 'none';
      scrollContainerRef.current.style.transform = 'translateY(0)';
    }
    if (titleRef.current) {
      titleRef.current.style.transition = 'none';
      titleRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (nextTitleRef.current) {
      nextTitleRef.current.style.display = 'none';
      nextTitleRef.current.style.transition = 'none';
      nextTitleRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (nextImageRef.current) {
      nextImageRef.current.style.transition = 'none';
      nextImageRef.current.style.transform = 'translate3d(0, 0, 0)';
    }

    setTimeout(() => {
      setDetail(getMediaObjectBySlug(params.slug, 'photo'));
      setGoingNext(false);

      if (titleRef.current && !titleRef.current.style.transition.includes('opacity')) {
        titleRef.current.style.transition += ', opacity 300ms';
      }
    }, 200);
  }, [location.pathname]);

  // Scroll logic
  React.useEffect(() => {
    if (containerRef.current && !state.ui.loading) {
      scroller = new SmoothScroll('#photos-container');

      scroller.on((scrollY, bodyEl, bottomEdge) => {
        if (isGoingNext) {
          return;
        }

        const titleBounds = titleRef.current?.getBoundingClientRect();

        if (!titleBounds) {
          return;
        }

        const PADDING = 200;
        const topEdge = window.innerHeight - PADDING - titleBounds.height;
        const bodyHeight = bodyEl.offsetHeight - window.innerHeight - PADDING;
        const titleY = (scrollY / bodyHeight) * topEdge;

        if (titleRef.current) {
          if (titleY < topEdge) {
            titleRef.current.style.transform = `translate3d(0, ${-titleY}px, 0)`;
          } else {
            titleRef.current.style.transform = `translate3d(0, ${-topEdge}px, 0)`;
          }
        }

        if (nextImageRef.current) {
          nextImageRef.current.style.transform = `translate3d(0, ${-scrollY}px, 0)`;
        }

        if (nextTitleRef.current) {
          const nextTitleEdge = bottomEdge - window.innerHeight * 2 + 200;

          if (scrollY < nextTitleEdge) {
            if (nextTitleRef.current.style.display !== 'block') {
              nextTitleRef.current.style.display = 'block';
            }

            nextTitleRef.current.style.transform = `translate3d(0, ${-scrollY}px, 0)`;
          } else {
            nextTitleRef.current.style.transform = `translate3d(0, ${-nextTitleEdge}px, 0)`;
          }
        }

        const nextEdge = Math.round(bodyEl.offsetHeight);

        // Reached bottom, start transition
        if (!isGoingNext && scrollY >= nextEdge) {
          window.scrollTo(0, nextEdge);

          if (nextImageRef.current) {
            nextImageRef.current.style.transform = `translate3d(0, ${-nextEdge}px, 0)`;
          }

          setGoingNext('starting');
          loader?.pageLoader.reset();

          if (state.ui.loading === false) {
            state.ui.setLoading('page');
          }

          // Fade out current title
          if (titleRef.current) {
            titleRef.current.style.transition = 'opacity 500ms 500ms';
            titleRef.current.style.opacity = '0';
          }

          // Remove visible class for transition animation
          const curCover = document.getElementById('current-cover');
          if (curCover) {
            curCover.classList.remove('visible');
          }

          setTimeout(() => {
            setGoingNext('ending');

            const style = bodyEl.style.transition;
            bodyEl.style.transition = 'none';
            bodyEl.style.transform = 'translateY(0)';

            setTimeout(() => {
              bodyEl.style.transition = style;
            }, 100);

            if (detail) {
              setSections({
                head: nextDetail?.bedroom_media_layouts[0],
                body: [],
              });
            }

            if (titleRef.current) {
              titleRef.current.style.opacity = '1';
              titleRef.current.style.transition = 'none';
              titleRef.current.style.transform = 'translate3d(0, 0, 0)';
            }

            if (nextTitleRef.current) {
              nextTitleRef.current.style.transition = 'none';
              nextTitleRef.current.style.transform = 'translate3d(0, 0, 0)';
            }

            if (nextImageRef.current) {
              nextImageRef.current.style.transition = 'none';
              nextImageRef.current.style.transform = 'translate3d(0, 0, 0)';
            }

            window.scrollTo(0, 0);

            // Route to next page
            setTimeout(() => {
              history.push(`/photos/${detail?.next}?next=1`);
            }, 2000);
          }, 1500);
        }
      });
    }

    return function cleanup() {
      scroller?.destroy();
    };
  }, [containerRef, state.ui.loading, isGoingNext]);

  React.useEffect(() => {
    if (!detail) {
      return;
    }

    setNextDetail(getMediaObjectBySlug(detail.next, 'photo'));

    if (state.ui.loading === false) {
      state.ui.setLoading('page');
    }

    const head = detail.bedroom_media_layouts[0];
    loader
      ?.addImageAsset((img) => {
        img.src = CMS_URL + head!.media[0]!.url;
      })
      .then(loader?.pageLoader.addLoaded);

    const body: i.Layout[] = [];
    for (let i = 1; i < detail.bedroom_media_layouts.length; i++) {
      const row = detail.bedroom_media_layouts[i]!;

      body.push(row);

      for (const photo of row.media) {
        loader
          ?.addImageAsset((img) => {
            img.src = CMS_URL + photo.url;
          })
          .then(loader?.pageLoader.addLoaded);
      }
    }

    // Set head instantly
    setSections({ head, body: [] });

    // Delay adding body so head is rendered first so it doesnt mess up animations
    setTimeout(() => {
      setSections({ head, body });
    }, 100);
  }, [detail]);

  React.useEffect(() => {
    if (state.ui.loading) {
      return;
    }

    // Delay for page transitions / wait for all img elements to be rendered
    setTimeout(() => {
      if (sections.body.length === 0) {
        return;
      }

      if (observers.length > 0) {
        return;
      }

      const imgEls = document.querySelectorAll('[data-img-container]');
      if (!imgEls) {
        return;
      }

      // Observe position of all images
      for (const imgEl of imgEls) {
        if (imgEl.id === 'next-cover') {
          continue;
        }

        const observer = new IntersectionObserver((entries, obs) => {
          const entry = entries[0];

          if (!entry) {
            return;
          }

          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            obs.disconnect();
          }
        }, {
          threshold: .15,
        });

        observer.observe(imgEl);
        observers.push(observer);

        // Fix img height
        const img = imgEl.querySelector('img');

        if (img) {
          function fixHeight() {
            const img = imgEl.querySelector('img');
            const figure = imgEl.querySelector('figure');

            if (img && figure) {
              const height = img.naturalHeight / img.naturalWidth * 100;
              figure.style.paddingBottom = `${height}%`;
            }
          }

          // Try immediately
          fixHeight();

          // And async
          img.addEventListener('load', fixHeight);
        }
      }
    }, 500);

    return function cleanup() {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, [sections, state.ui.loading]);

  return (
    <PhotoDetailContainer>
      <SEO
        pageTitle={detail?.title}
        ogDescription={detail?.title}
        ogImg={CMS_URL + detail?.media_cover.formats?.medium?.url}
      />
      <DetailContainer id="photos-container" ref={containerRef}>
        <div ref={scrollContainerRef} id="photos-container__body">
          {sections.head && (
            <Row $height={sections.head.media[0]!.height}>
              <RowImg
                id="current-cover"
                layout={sections.head}
                isNextHeader={!!isGoingNext || queries.has('next')}
                photo={sections.head.media[0]!}
              />
            </Row>
          )}
          {sections.body && (
            <FullContentContainer id="full-content">
              {sections.body.map((row) => (
                <Row key={row.id} displayType={row.display_type} location={row.row_location}>
                  {row.media.map((photo, i) => (
                    <RowImg
                      key={photo.id}
                      layout={row}
                      photo={photo}
                      index={i}
                    />
                  ))}
                </Row>
              ))}
            </FullContentContainer>
          )}
        </div>

        {nextDetail && (
          <NextContainer data-scroll-container>
            {nextDetail.bedroom_media_layouts[0] && (
              <div ref={nextImageRef} data-scroll>
                <RowImg
                  id="next-cover"
                  layout={nextDetail.bedroom_media_layouts[0]}
                  photo={nextDetail.bedroom_media_layouts[0].media[0]!}
                  isNextHeader
                />
              </div>
            )}

            <MediaTitle
              ref={nextTitleRef}
              side="L"
              visible={!state.ui.isAnyMenuOpen() && sections.body.length > 0}
              dataset={{ 'data-scroll': true }}
            >
              {nextDetail.title}
            </MediaTitle>
          </NextContainer>
        )}
      </DetailContainer>
      <div id="photos-container--hitbox" />
      <MediaTitle
        ref={titleRef}
        side="L"
        visible={!state.ui.isAnyMenuOpen()}
        dataset={{ 'data-scroll': true }}
      >
        {isGoingNext === 'ending' ? nextDetail?.title || '' : detail?.title || ''}
      </MediaTitle>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
