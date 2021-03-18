import * as i from 'types';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';
import { useQuery } from 'hooks';

import MediaTitle from 'common/typography/MediaTitle';
import { DetailContainer } from 'common/presentation/DetailPage';

import RowImg from './components/RowImg';
import { PhotoDetailContainer, FullContentContainer, NextContainer, Row } from './styled';


let scroller: VirtualScroll;
let observers: IntersectionObserver[] = [];
let loaded = 0;
let photosAmt = 0;

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
  const headRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const nextPhotoRef = React.useRef<HTMLImageElement>(null);
  const nextTitleRef = React.useRef<HTMLHeadingElement>(null);
  const [sections, setSections] = React.useState<Sections>({
    head: undefined,
    body: [],
  });
  const [detail, setDetail] = React.useState<i.StatePhotoObject | undefined>(
    getMediaObjectBySlug(params.slug, 'photo'),
  );
  const [isGoingNext, setGoingNext] = React.useState<GoingNextPhases>(
    queries.has('next') ? 'ending' : false,
  );

  // Initialise
  React.useEffect(() => {
    if (!detail) {
      setDetail(getMediaObjectBySlug(params.slug, 'photo'));
    }
  }, [state.allMedia]);

  // Route change transition/reset
  React.useEffect(() => {
    for (const observer of observers) {
      observer.disconnect();
    }

    observers = [];

    setSections({ head: undefined, body: [] }); // Necessary for transitions between clicking photos pages
    setDetail(getMediaObjectBySlug(params.slug, 'photo'));

    if (scroller) {
      scroller.__private_3_event.y = 0;
    }

    if (headRef.current) {
      headRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (bodyRef.current) {
      bodyRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (titleRef.current) {
      titleRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (nextTitleRef.current) {
      nextTitleRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (nextPhotoRef.current) {
      nextPhotoRef.current.style.transform = 'translate3d(0, 0, 0)';
    }

    setGoingNext(false);
  }, [location.pathname]);

  // Scroll logic
  React.useEffect(() => {
    scroller = new VirtualScroll({
      mouseMultiplier: 1,
    });

    scroller.on((scroll) => {
      // Disable scrolling past top
      if (scroll.y > 0) {
        scroll.y = 0;
        scroller.__private_3_event.y = 0;
      }

      // Disable scrolling if transitioning
      if (!isGoingNext && !state.loading && containerRef.current && bodyRef.current && titleRef.current) {
        const containerBounds = containerRef.current.getBoundingClientRect();
        const bodyBounds = bodyRef.current.getBoundingClientRect();
        const titleBounds = titleRef.current.getBoundingClientRect();
        const bottomEdge = containerBounds.height - window.innerHeight;

        // Start transition to next page
        if (Math.abs(scroll.y) >= bottomEdge && !isGoingNext) {
          setGoingNext('starting');

          if (state.loading === false) {
            state.setLoading('page');
          }

          // Set head piece to next's
          setSections((sections) => ({
            ...sections,
            head: detail?.next.bedroom_media_layouts[0],
          }));

          // Remove visible class for transition animation
          const curCover = document.getElementById('current-cover');
          if (curCover) {
            curCover.classList.remove('visible');
          }

          // Set scroll positions to top
          scroller.__private_3_event.y = 0;
          scroll.y = 0;

          if (headRef.current) {
            headRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
          if (bodyRef.current) {
            bodyRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
          if (nextPhotoRef.current) {
            nextPhotoRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
          if (titleRef.current) {
            titleRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
          if (nextTitleRef.current) {
            nextTitleRef.current.style.transform = 'translate3d(0, 0, 0)';
          }

          // Route to next page
          setTimeout(() => {
            history.push(`/photos/${detail?.next.slug}?next=1`);
          }, 2000);

          // Prevent other scroll effects from happening
          return;
        }

        // With 100px clearance top & bottom
        const PHOTO_PADDING = window.innerHeight * .3;
        const CONTAINER_PADDING = 200;
        const topEdge = window.innerHeight - titleBounds.height - 100 * 2;

        const titleY =
          (Math.abs(scroll.y) / (bodyBounds.height + CONTAINER_PADDING + PHOTO_PADDING)) * topEdge;

        // Top edge
        if (titleY < topEdge) {
          titleRef.current.style.transform = `translate3d(0, -${titleY}px, 0)`;
        }

        const TOP_POS = 110;
        const deltaBottomScrollDist = bottomEdge - Math.abs(scroll.y);
        const nextTitleEdge = (window.innerHeight - CONTAINER_PADDING - TOP_POS);

        if (nextTitleEdge < deltaBottomScrollDist) {
          nextTitleRef.current!.style.transform = `translate3d(0, ${scroll.y}px, 0)`;
        }

        if (headRef.current) {
          headRef.current.style.transform = `translate3d(0, ${scroll.y}px, 0)`;
        }

        bodyRef.current.style.transform = `translate3d(0, ${scroll.y}px, 0)`;

        if (nextPhotoRef.current) {
          nextPhotoRef.current.style.transform = `translate3d(0, ${scroll.y}px, 0)`;
        }
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, [bodyRef, detail, isGoingNext, state.mouseMultiplier, state.loading]);

  React.useEffect(() => {
    if (queries.has('next')) {
      setSections({
        head: detail?.bedroom_media_layouts[0],
        body: [],
      });
    }
  }, [params.slug, state.allMedia, state.templates]);

  React.useEffect(() => {
    if (!detail) {
      return;
    }

    if (state.loading === false) {
      state.setLoading('page');
    }

    const head = detail.bedroom_media_layouts[0];
    const img = document.createElement('img');
    img.onload = handleLoad;
    img.src = CMS_URL + head!.media[0]!.url;
    photosAmt++;

    const body: i.Layout[] = [];
    for (let i = 1; i < detail.bedroom_media_layouts.length; i++) {
      const row = detail.bedroom_media_layouts[i]!;

      body.push(row);

      for (const photo of row.media) {
        const img = document.createElement('img');
        img.onload = handleLoad;
        img.src = CMS_URL + photo.url;
        photosAmt++;
      }
    }

    // Set head instantly
    setSections({ head, body: [] });

    // Delay adding body so head is rendered first so it doesnt mess up animations
    setTimeout(() => {
      setSections({ head, body });
    }, 100);

    return function cleanup() {
      loaded = 0;
      photosAmt = 0;
    };
  }, [detail]);

  React.useEffect(() => {
    if (state.loading) {
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
  }, [sections, state.loading]);

  function handleLoad() {
    loaded++;

    if (loaded >= photosAmt) {
      state.setLoading(false);
    }
  }

  return (
    <PhotoDetailContainer>
      <DetailContainer ref={containerRef}>
        {sections.head && (
          <div ref={headRef}>
            <Row $height={sections.head.media[0]!.height}>
              <RowImg
                id="current-cover"
                layout={sections.head}
                isNextHeader={isGoingNext === 'starting' || queries.has('next')}
                photo={sections.head.media[0]!}
              />
            </Row>
          </div>
        )}
        {sections.body && (
          <FullContentContainer ref={bodyRef} id="full-content">
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
        <NextContainer>
          <div>
            {detail?.next.bedroom_media_layouts[0] && (
              <div ref={nextPhotoRef}>
                <RowImg
                  id="next-cover"
                  layout={detail.next.bedroom_media_layouts[0]}
                  photo={detail.next.bedroom_media_layouts[0].media[0]!}
                  isNextHeader
                />
              </div>
            )}

            <MediaTitle
              ref={nextTitleRef}
              side="L"
              visible={!state.isAnyMenuOpen() && sections.body.length > 0}
            >
              {detail?.next.title}
            </MediaTitle>
          </div>
        </NextContainer>
      </DetailContainer>
      <MediaTitle
        ref={titleRef}
        side="L"
        visible={!state.isAnyMenuOpen()}
        autoHide
      >
        {isGoingNext ? detail?.next.title : detail?.title}
      </MediaTitle>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
