import * as i from 'types';
import React from 'react';

import { Img, ImgContainer, ImgFigure } from './styled';


const RowImg: React.VFC<RowImgProps> = (props) => {
  const index = (props.index ?? 0) + 1;
  const attrs = props.id ? { id: props.id } : {};

  return (
    <ImgContainer
      displayType={props.layout.display_type}
      isNextHeader={props.isNextHeader}
      offsetX={props.layout[`offset_x_${index}`]}
      offsetY={props.layout[`offset_y_${index}`]}
      $scale={props.layout[`scale_${index}`]}
      {...attrs}
    >
      <ImgFigure>
        <Img src={CMS_URL + props.photo.url} alt={props.photo.alternativeText} />
      </ImgFigure>
    </ImgContainer>
  );
};

export type RowImgProps = {
  layout: i.Layout;
  photo: i.PhotoMedia;
  isNextHeader?: boolean;
  id?: string;
  index?: number;
};

export default RowImg;
