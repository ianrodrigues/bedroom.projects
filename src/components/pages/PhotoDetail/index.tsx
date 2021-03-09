import * as i from 'types';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';

import MediaTitle from 'common/typography/MediaTitle';
import { DetailContainer } from 'common/presentation/DetailPage';

import { FullContentContainer, Img, NextContainer, Row } from './styled';

// CBA typing
let scroller: i.AnyObject;
let observers: IntersectionObserver[] = [];

interface Sections {
  head?: i.Layout[];
  body: i.Layout[][];
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
  const nextPhotoRef = React.useRef<HTMLImageElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const nextTitleRef = React.useRef<HTMLHeadingElement>(null);
  const [template, setTemplate] = React.useState(state.templates[params.slug]);
  const [nextTemplate, setNextTemplate] = React.useState<i.PhotoDetailTemplate | undefined>();
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
            head: state.templates[detail!.next.slug]![1],
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

          // Route to next page
          setTimeout(() => {
            history.push(`/photos/${detail?.next.slug}?next=1`);
          }, 2000);

          // Prevent other scroll effects from happening
          return;
        }

        // With 100px clearance top & bottom
        const topEdge = window.innerHeight - titleBounds.height - 100 * 2;

        const y = (Math.abs(event.y) / bodyBounds.height) * topEdge;

        // Top edge
        if (y < topEdge) {
          titleRef.current.style.transform = `translate3d(0, -${y}px, 0)`;
        }

        if (headRef.current) {
          headRef.current.style.transform = `translate3d(0, ${event.y}px, 0)`;
        }

        bodyRef.current.style.transform = `translate3d(0, ${event.y}px, 0)`;

        if (nextTitleRef.current) {
          const nextTitleBounds = nextTitleRef.current.getBoundingClientRect();
          const nextTitleEdge = bodyBounds.height + nextTitleBounds.height + 190; // 190px is just magic rn

          if (Math.abs(event.y) <= nextTitleEdge) {
            nextTitleRef.current.style.transform = `translate3d(0, ${event.y}px, 0)`;
          }
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
    setTemplate(state.templates[params.slug]);
    setDetail(getMediaObjectBySlug(params.slug, 'photo'));
  }, [params.slug, state.allMedia, state.templates]);

  React.useEffect(() => {
    if (!template) {
      return;
    }

    const head = template[1];
    const body: i.Layout[][] = [];

    for (let i = 2; i < template.length; i++) {
      body.push(template[i]!);
    }

    // Set head instantly
    setSections({ head, body: [] });

    // Delay adding body so head is rendered first so it doesnt mess up animations
    setTimeout(() => {
      setSections({ head, body });
    }, 100);

    if (detail) {
      setNextTemplate(state.templates[detail.next.slug]);
    }
  }, [template]);

  React.useEffect(() => {
    // Delay for page transitions / wait for all img elements to be rendered
    setTimeout(() => {
      if (sections.body.length === 0) {
        return;
      }

      if (observers.length > 0) {
        return;
      }

      const imgEls = document.getElementsByTagName('img');
      if (!imgEls) {
        return;
      }

      // Observe position of all images
      for (const imgEl of Array.from(imgEls)) {
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
          threshold: .1,
        });

        observer.observe(imgEl);
        observers.push(observer);
      }
    }, 500);

    // if (nextPhotoRef.current) {
    //   const observer = new IntersectionObserver((entries) => {
    //     const entry = entries[0];

    //     if (!entry) {
    //       return;
    //     }

    //     setShowTitle(!entry.isIntersecting);
    //   }, {
    //     threshold: .5,
    //   });

    //   observer.observe(nextPhotoRef.current);
    // }

    return function cleanup() {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, [sections]);

  return (
    <>
      <DetailContainer ref={containerRef}>
        {sections.head && (
          <div ref={headRef}>
            <Row $height={sections.head[0]!.media[0]!.height}>
              <Img
                src={CMS_URL + sections.head[0]!.media[0]!.url}
                alt={sections.head[0]!.alt_text}
                isNextHeader={isGoingNext === 'starting' || queries.has('next')}
              />
            </Row>
          </div>
        )}
        {sections.body && (
          <FullContentContainer ref={bodyRef} id="full-content">
            {sections.body.map((row, i) => (
              <Row key={i}>
                {/* A row num might be unused/forgotten */}
                {row?.map((photo) => (
                  <Img
                    key={photo.id}
                    src={CMS_URL + photo.media[0]!.url}
                    alt={photo.alt_text}
                    position={photo.row_location}
                    offsetX={photo.offset_x}
                    offsetY={photo.offset_y}
                    $scale={photo.scale}
                  />
                ))}
              </Row>
            ))}
          </FullContentContainer>
        )}
        <NextContainer>
          <MediaTitle ref={nextTitleRef} side="L" visible={!state.isAnyMenuOpen()}>
            {detail?.next.title}
          </MediaTitle>
          <div ref={nextPhotoRef}>
            {nextTemplate && (
              <Img
                src={CMS_URL + nextTemplate[1]?.[0]?.media[0]?.url}
                alt={detail?.next.media_cover.alternativeText}
                id="next-cover"
              />
            )}
          </div>
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
