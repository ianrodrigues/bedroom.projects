import * as i from 'types';
import React from 'react';
import { useQuery } from 'react-query';
import Showdown from 'showdown';
import VirtualScroll from 'virtual-scroll';

import useStore from 'state';

import MediaTitle from 'common/typography/MediaTitle';

import { InfoContainer, InfoDescription, InfoFigure } from './styled';


let scroller: VirtualScroll;
let loaded = 0;
const LOADED_AMT = 1;

const Info: React.VFC = () => {
  const state = useStore();
  const [visible, setVisible] = React.useState(false);
  const descriptionRef = React.useRef<HTMLDivElement>(null);
  const { data } = useQuery<i.APIInfoObject, Error>('info', () =>
    fetch(CMS_URL + '/bedroom-infos/1')
      .then((res) => res.json())
      .then((data: i.APIInfoObject) => {
        const converter = new Showdown.Converter();
        const html = converter.makeHtml(data.description);
        const newData: i.APIInfoObject = {
          ...data,
          description: html,
        };

        const img = document.createElement('img');
        img.onload = handleLoaded;
        img.src = CMS_URL + newData.image.url;

        return newData;
      }),
  );

  React.useEffect(() => {
    scroller = new VirtualScroll({
      mouseMultiplier: 1,
    });

    scroller.on((scroll) => {
      if (!descriptionRef.current) {
        return;
      }

      // Disable scrolling past top
      if (scroll.y > 0) {
        scroll.y = 0;
        scroller.__private_3_event.y = 0;
      }

      const PADDING_BOTTOM = 20;
      const containerBounds = descriptionRef.current.getBoundingClientRect();
      const bottomEdge = PADDING_BOTTOM + Math.abs(window.innerHeight - containerBounds.height);

      // No need to scroll
      if (20 + containerBounds.height < window.innerHeight) {
        return;
      }

      if (Math.abs(scroll.y) < bottomEdge) {
        descriptionRef.current.style.transform = `translate3d(0, ${scroll.y}px, 0)`;
      } else {
        // Stop scroll momentum
        scroll.y = -bottomEdge;
        scroller.__private_3_event.y = -bottomEdge;
      }
    });

    return function cleanup() {
      scroller.destroy();
    };
  }, []);

  React.useEffect(() => {
    if (!data && !state.loading) {
      state.setLoading('page');
    }
  }, [data]);

  function handleLoaded() {
    loaded++;

    if (loaded >= LOADED_AMT) {
      state.setLoading(false);

      setTimeout(() => {
        setVisible(true);
      }, 500);
    }
  }

  if (!data || state.loading) {
    return null;
  }

  return (
    <InfoContainer $visible={visible}>
      <InfoDescription ref={descriptionRef} dangerouslySetInnerHTML={{ __html: data.description }} />

      <InfoFigure>
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        <img src={CMS_URL + data.image.url} alt={data.image.alternativeText} />
      </InfoFigure>

      <MediaTitle side="R" visible>{data.title}</MediaTitle>
    </InfoContainer>
  );
};

export default Info;
