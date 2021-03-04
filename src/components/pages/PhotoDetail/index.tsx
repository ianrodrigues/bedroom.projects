import * as i from 'types';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';

import { Img, PhotoDetailContainer, Row } from './styled';

let scroller: any;
let observers: IntersectionObserver[] = [];

interface Sections {
  head?: i.Layout[];
  body: i.Layout[][];
}

const PhotoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  const headRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [template, setTemplate] = React.useState(state.templates[params.slug]);
  const [sections, setSections] = React.useState<Sections>({
    head: undefined,
    body: [],
  });

  React.useEffect(() => {
    for (const observer of observers) {
      observer.disconnect();
    }

    observers = [];

    setSections({ head: undefined, body: [] });

    if (scroller) {
      scroller.__private_3_event.y = 0;
    }

    if (headRef.current && bodyRef.current) {
      headRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
      bodyRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (headRef.current && bodyRef.current) {
      scroller = new VirtualScroll({
        mouseMultiplier: .3,
      });

      scroller.on((event: any) => {
        if (event.y > 0) {
          event.y = 0;
          scroller.__private_3_event.y = 0;
        }

        if (event.y === 0) {
          event.y = event.deltaY;
        }

        headRef.current!.style.transform = `translate3d(0px, ${event.y}px, 0px)`;
        bodyRef.current!.style.transform = `translate3d(0px, ${event.y}px, 0px)`;
      });
    }

    return function cleanup() {
      scroller.destroy();
    };
  }, [headRef, bodyRef]);

  React.useEffect(() => {
    setTemplate(state.templates[params.slug]);
  }, [params.slug, state.allMedia, state.templates]);

  React.useEffect(() => {
    if (!template) {
      return;
    }

    const head = template[1];
    const body: i.Layout[][] = [];

    for (let i = 2; i < template!.length; i++) {
      body.push(template![i]!);
    }

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
    <PhotoDetailContainer id="content-container">
      <div ref={headRef} id="scroll-head">
        {sections.head && (
          <Row>
            <Img
              src={CMS_URL + sections.head[0]!.media.url}
              alt={sections.head[0]!.media.alternativeText}
            />
          </Row>
        )}
      </div>
      <div ref={bodyRef}>
        {sections.body && sections.body.map((row, i) => (
          <Row key={i}>
            {row.map((photo) => (
              <Img
                key={photo.id}
                src={CMS_URL + photo.media.url}
                alt={photo.media.alternativeText}
                position={photo.row_location}
                offsetX={photo.offset_x}
                offsetY={photo.offset_y}
                scale={photo.scale}
              />
            ))}
          </Row>
        ))}
      </div>
      <div>next piece</div>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
