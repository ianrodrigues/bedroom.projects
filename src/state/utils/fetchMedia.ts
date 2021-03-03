import * as i from 'types';
import useStore from 'state';


export function fetchMedia(): void {
  fetch(`${CMS_URL}/bedroom-medias`)
    .then((res) => res.json())
    .then((data: i.APIMediaObject[]) => {
      const photos = [];
      const videos = [];

      for (const media of data) {
        if (media.video_url || media.full_video) {
          videos.push(media);
        } else {
          photos.push(media);
        }
      }

      useStore.getState().setAllMedia({
        photo: photos,
        video: videos,
      });

      if (photos[0]) {
        useStore.getState().setMedia('photo', photos[0]);
      }

      if (videos[0]) {
        useStore.getState().setMedia('video', videos[0]);
      }
    });
}
