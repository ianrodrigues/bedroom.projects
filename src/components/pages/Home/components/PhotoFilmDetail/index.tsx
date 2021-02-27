import React from 'react';
import { useParams } from 'react-router';


interface Params {
  id: string;
}

const PhotoFilmDetail: React.VFC = () => {
  const params = useParams<Params>();

  return (
    <div>{params.id}</div>
  );
};

export default PhotoFilmDetail;
