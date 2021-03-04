import * as i from 'types';
import React from 'react';
import { useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';
import { getMediaObjectBySlug } from 'state/utils';

import { PhotoDetailContainer } from './styled';

let scroller: any;

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
        mouseMultiplier: .5,
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

      setSections({ head, body });
    }
  }, [detail]);

  return (
    <PhotoDetailContainer>
      <div ref={headRef} id="scroll-head">
        {sections.head && (
          <img src={CMS_URL + sections.head.media.url} alt={sections.head.media.alternativeText} />
        )}
      </div>
      <div id="scroll-body">
        {sections.body && sections.body.map((layout) => (
          <img key={layout.id} src={CMS_URL + layout.media.url} alt={layout.media.alternativeText} />
        ))}
      </div>
      <div>next piece</div>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
