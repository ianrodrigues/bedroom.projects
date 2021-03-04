import * as i from 'types';
import React from 'react';
import { useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';

import { Img, PhotoDetailContainer } from './styled';

let scroller: any;
const observers: IntersectionObserver[] = [];

interface Sections {
  head?: i.Layout;
  body: i.Layout[];
}

const PhotoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<{ slug: string }>();
  const headRef = React.useRef<HTMLDivElement>(null);
  const [detail, setDetail] = React.useState(getMediaObjectBySlug(params.slug, 'photo'));
  const [sections, setSections] = React.useState<Sections>({
    head: undefined,
    body: [],
  });

  React.useEffect(() => {
    if (headRef.current) {
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

        const body = document.querySelector('#scroll-body') as HTMLDivElement;

        headRef.current!.style.transform = `translate3d(0px, ${event.y}px, 0px)`;
        body.style.transform = `translate3d(0px, ${event.y}px, 0px)`;
      });
    }

    return function cleanup() {
      scroller.destroy();
    };
  }, [headRef]);

  React.useEffect(() => {
    setDetail(getMediaObjectBySlug(params.slug, 'photo'));
  }, [params.slug, state.allMedia]);

  React.useEffect(() => {
    if (detail) {
      const head = detail.bedroom_media_layouts[0];
      const body: i.Layout[] = [];

      for (let i = 1; i < detail!.bedroom_media_layouts.length; i++) {
        body.push(detail!.bedroom_media_layouts[i]!);
      }

      setSections({ head, body: [] });

      // Delay adding body so head is rendered first so it doesnt mess up animations
      setTimeout(() => {
        setSections({ head, body });
      }, 100);
    }
  }, [detail]);

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
          threshold: .25,
        });

        observer.observe(imgEl);
        observers.push(observer);
      }
    }, 100); // Delay for page transitions / wait for all img elements to be rendered

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
          <figure>
            <Img src={CMS_URL + sections.head.media.url} alt={sections.head.media.alternativeText} />
          </figure>
        )}
      </div>
      <div id="scroll-body">
        {sections.body && sections.body.map((layout) => (
          <figure key={layout.id}>
            <Img
              src={CMS_URL + layout.media.url}
              alt={layout.media.alternativeText}
            />
          </figure>
        ))}
      </div>
      <div>next piece</div>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
