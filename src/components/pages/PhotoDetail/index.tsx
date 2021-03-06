import * as i from 'types';
import React from 'react';
import { useLocation, useParams } from 'react-router';
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

const PhotoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<i.DetailPageParams>();
  const location = useLocation();
  const headRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const nextRef = React.useRef<HTMLDivElement>(null);
  const [template, setTemplate] = React.useState(state.templates[params.slug]);
  const [sections, setSections] = React.useState<Sections>({
    head: undefined,
    body: [],
  });
  const [detail, setDetail] = React.useState<i.StatePhotoObject | undefined>(
    getMediaObjectBySlug(params.slug, 'photo'),
  );

  React.useEffect(() => {
    for (const observer of observers) {
      observer.disconnect();
    }

    observers = [];

    setSections({ head: undefined, body: [] });
    setDetail(getMediaObjectBySlug(params.slug, 'photo'));

    if (scroller) {
      scroller.__private_3_event.y = 0;
    }

    if (containerRef.current) {
      containerRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
    }
    if (titleRef.current) {
      titleRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
    }
  }, [location.pathname]);

  React.useEffect(() => {
    scroller = new VirtualScroll({
      mouseMultiplier: .3,
    });

    // CBA typing
    scroller.on((event: i.AnyObject) => {
      if (event.y > 0) {
        event.y = 0;
        scroller.__private_3_event.y = 0;
      }

      if (containerRef.current && bodyRef.current && titleRef.current) {
        const containerBounds = containerRef.current.getBoundingClientRect();
        const bodyBounds = bodyRef.current.getBoundingClientRect();
        const titleBounds = titleRef.current.getBoundingClientRect();

        // With 100 px clearance top & bottom
        const topEdge = window.innerHeight - titleBounds.height - 100 * 2;

        const y = (Math.abs(event.y) / bodyBounds.height) * topEdge;

        // Top edge
        if (y < topEdge) {
          titleRef.current.style.transform = `translate3d(0px, -${y}px, 0px)`;
        }

        const bottomEdge = containerBounds.height - window.innerHeight;

        if (Math.abs(event.y) >= bottomEdge) {
          scroller.__private_3_event.y = -bottomEdge;
          event.y = -bottomEdge;
        }

        containerRef.current.style.transform = `translate3d(0px, ${event.y}px, 0px)`;
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, [bodyRef]);

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
  }, [template]);

  React.useEffect(() => {
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
        const observer = new IntersectionObserver((entries, obs) => {
          const entry = entries[0];

          if (!entry) return;

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
    }, 500); // Delay for page transitions / wait for all img elements to be rendered

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
            <Row $height={sections.head[0]!.media.height}>
              <Img
                src={CMS_URL + sections.head[0]!.media.url}
                alt={sections.head[0]!.alt_text}
              />
            </Row>
          </div>
        )}
        {sections.body && (
          <FullContentContainer ref={bodyRef} id="full-content">
            {sections.body.map((row, i) => (
              <Row key={i}>
                {row.map((photo) => (
                  <Img
                    key={photo.id}
                    src={CMS_URL + photo.media.url}
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
        <NextContainer ref={nextRef}>
          {detail?.next?.title}
        </NextContainer>
      </DetailContainer>
      <MediaTitle ref={titleRef} side="L" visible={!state.isAnyMenuOpen()}>
        {detail?.title}
      </MediaTitle>
    </>
  );
};

export default PhotoDetail;
