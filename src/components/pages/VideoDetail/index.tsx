import * as i from 'types';
import React from 'react';
import { useParams } from 'react-router';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';

import MediaTitle from 'common/typography/MediaTitle';
import { DetailContainer } from 'common/presentation/DetailPage';
import { getMediaObjectBySlug } from 'state/utils';

import Player from './components/Player';
import { DescriptionContainer } from './styled';


let scroller: i.AnyObject;


const VideoDetail: React.VFC = () => {
  const state = useStore();
  const params = useParams<i.DetailPageParams>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const [detail, setDetail] = React.useState<i.CurNextDetails<'video'>>({
    cur: getMediaObjectBySlug(params.slug, 'video'),
    next: undefined,
  });

  React.useEffect(() => {
    setDetail({
      cur: getMediaObjectBySlug(params.slug, 'video'),
      next: undefined,
    });
  }, [params.slug, state.allMedia?.video]);

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

      if (event.y === 0) {
        event.y = event.deltaY;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(0px, ${event.y}px, 0px)`;

        if (titleRef.current) {
          const containerBounds = containerRef.current.getBoundingClientRect();
          const titleDistance = window.innerHeight - 105 * 2; // Minus top/bottom distance
          const y = (Math.abs(event.y) / containerBounds.height) * titleDistance;

          // Minus font size, roughly
          if (y < titleDistance - 75) {
            titleRef.current.style.transform = `translate3d(0px, -${y}px, 0px)`;
          }
        }
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, [containerRef]);

  return (
    <>
      <DetailContainer ref={containerRef}>
        {detail.cur && <Player videoObject={detail.cur} />}
        <DescriptionContainer>
          <div>{detail.cur?.description}</div>
          <div>{detail.cur?.credits}</div>
        </DescriptionContainer>
        <div>next piece</div>
      </DetailContainer>
      <MediaTitle ref={titleRef} side="R" visible={!state.isAnyMenuOpen()}>
        {detail.cur?.title}
      </MediaTitle>
    </>
  );
};

export default VideoDetail;
