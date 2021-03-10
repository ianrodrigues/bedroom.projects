import * as i from 'types';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';

import MediaTitle from 'common/typography/MediaTitle';
import { DetailContainer } from 'common/presentation/DetailPage';

import RowImg from './components/RowImg';
import { FullContentContainer, NextContainer, Row } from './styled';

// CBA typing
let scroller: i.AnyObject;
let observers: IntersectionObserver[] = [];

interface Sections {
  head?: i.Layout;
  body: i.Layout[];
}

type GoingNextPhases = false | 'starting' | 'ending';

function useQuery(location: ReturnType<typeof useLocation>) {
  return new URLSearchParams(location.search);
}

const PhotoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<i.DetailPageParams>();
  const history = useHistory();
  const location = useLocation();
  const queries = useQuery(location);
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

  React.useEffect(() => {
    for (const observer of observers) {
      observer.disconnect();
    }

    observers = [];

    setSections({ head: undefined, body: [] }); // Necessary for transitions between photos pages
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

  React.useEffect(() => {
    scroller = new VirtualScroll({
      mouseMultiplier: .3,
    });

    // CBA typing
    scroller.on((event: i.AnyObject) => {
      // Disable scrolling past top
      if (event.y > 0) {
        event.y = 0;
        scroller.__private_3_event.y = 0;
      }

      // Disable scrolling
      if (isGoingNext) {
        return;
      }

      if (containerRef.current && bodyRef.current && titleRef.current) {
        const containerBounds = containerRef.current.getBoundingClientRect();
        const bodyBounds = bodyRef.current.getBoundingClientRect();
        const titleBounds = titleRef.current.getBoundingClientRect();
        const bottomEdge = containerBounds.height - window.innerHeight;

        // Start transition to next page
        if (Math.abs(event.y) >= bottomEdge && !isGoingNext) {
          setGoingNext('starting');

          // Set head piece to next's
          setSections((sections) => ({
            ...sections,
            head: detail?.next.bedroom_media_layouts[0],
          }));

          // Set scroll positions to top
          scroller.__private_3_event.y = 0;
          event.y = 0;

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
        const PADDING_BOTTOM = 300;
        const topEdge = window.innerHeight - titleBounds.height - 100 * 2;

        const y = (Math.abs(event.y) / (bodyBounds.height + PADDING_BOTTOM)) * topEdge;

        // Top edge
        if (y < topEdge) {
          titleRef.current.style.transform = `translate3d(0, -${y}px, 0)`;
        }

        if (headRef.current) {
          headRef.current.style.transform = `translate3d(0, ${event.y}px, 0)`;
        }

        bodyRef.current.style.transform = `translate3d(0, ${event.y}px, 0)`;

        if (nextTitleRef.current) {
          nextTitleRef.current.style.transform = `translate3d(0, ${event.y}px, 0)`;
        }

        if (nextPhotoRef.current) {
          nextPhotoRef.current.style.transform = `translate3d(0, ${event.y}px, 0)`;
        }
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, [bodyRef, detail, isGoingNext]);

  React.useEffect(() => {
    setDetail(getMediaObjectBySlug(params.slug, 'photo'));

    setSections((sections) => ({
      head: detail?.bedroom_media_layouts[0],
      body: [],
    }));
  }, [params.slug, state.allMedia, state.templates]);

  React.useEffect(() => {
    if (!detail) {
      return;
    }

    const head = detail.bedroom_media_layouts[0];
    const body: i.Layout[] = [];

    for (let i = 1; i < detail.bedroom_media_layouts.length; i++) {
      body.push(detail.bedroom_media_layouts[i]!);
    }

    // Set head instantly
    setSections({ head, body: [] });

    // Delay adding body so head is rendered first so it doesnt mess up animations
    setTimeout(() => {
      setSections({ head, body });
    }, 100);
  }, [detail]);

  React.useEffect(() => {
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

          // Remove 'visible' class if next section is visible
          if (entry.target.id === 'next-cover') {
            const curCover = document.getElementById('current-cover') as HTMLDivElement;

            if (entry.isIntersecting) {
              curCover.classList.remove('visible');
            } else {
              curCover.classList.add('visible');
            }
          } else if (entry.isIntersecting) {
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
  }, [sections]);

  console.log(sections.head?.media[0]);

  return (
    <>
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
          <div ref={nextPhotoRef}>
            {detail?.next.bedroom_media_layouts[0] && (
              <RowImg
                id="next-cover"
                layout={detail.next.bedroom_media_layouts[0]}
                photo={detail.next.bedroom_media_layouts[0].media[0]!}
                isNextHeader
              />
            )}
          </div>
          <MediaTitle
            ref={nextTitleRef}
            side="L"
            visible={!state.isAnyMenuOpen()}
          >
            {detail?.next.title}
          </MediaTitle>
        </NextContainer>
      </DetailContainer>
      <MediaTitle
        ref={titleRef}
        side="L"
        visible={!state.isAnyMenuOpen()}
      >
        {isGoingNext ? detail?.next.title : detail?.title}
      </MediaTitle>
    </>
  );
};

export default PhotoDetail;
