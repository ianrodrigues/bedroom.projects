import * as i from 'types';
import React from 'react';

import { Img, ImgContainer, ImgFigure } from './styled';


const RowImg: React.VFC<RowImgProps> = (props) => {
  const index = (props.index ?? 0) + 1 as i.ImgAttributeIndices;
  const imgAttrs = [`offset_x_${index}`, `offset_y_${index}`, `scale_${index}`] as const;
  const containerAttrs = props.id ? { id: props.id } : {};

  return (
    <ImgContainer
      displayType={props.layout.display_type}
      isNextHeader={props.isNextHeader}
      offsetX={props.layout[imgAttrs[0]]}
      offsetY={props.layout[imgAttrs[1]]}
      $scale={props.layout[imgAttrs[2]]}
      {...containerAttrs}
    >
      <ImgFigure>
        <Img src={CMS_URL + props.photo.url} alt={props.photo.alternativeText} />
      </ImgFigure>
    </ImgContainer>
  );
};

export interface RowImgProps {
  layout: i.Layout;
  photo: i.PhotoMedia;
  isNextHeader?: boolean;
  id?: string;
  index?: number;
}

export default RowImg;
