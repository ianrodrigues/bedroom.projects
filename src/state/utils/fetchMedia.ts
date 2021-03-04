import * as i from 'types';

import useStore from 'state';
import { isAPIPhotoObject } from 'services/typeguards';


export function fetchMedia(): void {
  fetch(`${CMS_URL}/bedroom-medias`)
    .then((res) => res.json())
    .then((data: (i.APIMediaObject | i.APIPhotosObject)[]) => {
      const photos: i.APIPhotosObject[] = [];
      const videos: i.APIMediaObject[] = [];

      for (const media of data) {
        if (isAPIPhotoObject(media)) {
          photos.push(media);
        } else {
          videos.push(media);
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
    })
    .then(() => {
      const photos = useStore.getState().allMedia?.photo;

      if (photos) {
        // Sort media layout rows
        for (const photo of photos) {
          photo.bedroom_media_layouts.sort((a, b) => Number(a.row_num > b.row_num));
        }

        const photoDetailTemplates: i.PhotoDetailTemplates = {};

        for (const photoMediaObject of photos) {
          for (const template of photoMediaObject.bedroom_media_layouts) {
            const rowNum = template.row_num;
            let rows = photoDetailTemplates[photoMediaObject.slug];

            // Create first row if it doesn't exist
            if (!rows) {
              rows = [undefined];
            }

            // Create row array for row num if it doesn't exist
            if (!rows[rowNum]) {
              rows[rowNum] = [];
            }

            // Add template to row num array
            rows[rowNum]!.push(template);

            // Save template rows to its slug
            photoDetailTemplates[photoMediaObject.slug] = rows;
          }
        }

        useStore.getState().setTemplates(photoDetailTemplates);
      }
    });
}
