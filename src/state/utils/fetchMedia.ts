import * as i from 'types';
import Showdown from 'showdown';

import useStore from 'state';
import { isAPIPhotoObject } from 'services/typeguards';


export function fetchMedia(): void {
  fetch(`${CMS_URL}/bedroom-medias`)
    .then((res) => res.json())
    .then((data: (i.APIMediaObject | i.APIPhotosObject)[]) => {
      const photos: i.StatePhotoObject[] = [];
      const videos: i.StateVideoObject[] = [];
      let prevPhotoObj: i.StatePhotoObject | undefined = undefined;
      let prevVideoObj: i.StateVideoObject | undefined = undefined;

      // Create linked lists of photos/videos
      for (const media of data) {
        if (isAPIPhotoObject(media)) {
          const tempMedia = media as i.StatePhotoObject;
          tempMedia.next = {} as i.StatePhotoObject;

          photos.push(tempMedia);
        } else {
          const tempMedia = media as i.StateVideoObject;
          tempMedia.next = {} as i.StatePhotoObject;

          // Convert markdown to html
          if (tempMedia.description) {
            const converter = new Showdown.Converter();
            const html = converter.makeHtml(tempMedia.description);

            tempMedia.description = html;
          }

          if (tempMedia.credits) {
            const converter = new Showdown.Converter();
            const html = converter.makeHtml(tempMedia.credits);

            tempMedia.credits = html;
          }

          videos.push(tempMedia);
        }
      }

      // Sort
      photos.sort((a, b) => a.list_num - b.list_num);
      videos.sort((a, b) => a.list_num - b.list_num);

      // Make linked list
      for (const photo of photos) {
        if (prevPhotoObj) {
          prevPhotoObj.next = photo;
        }

        prevPhotoObj = photo;
      }

      for (const video of videos) {
        if (prevVideoObj) {
          prevVideoObj.next = video;
        }

        prevVideoObj = video;
      }

      // Link last to first
      if (photos[photos.length - 1] && photos[0]) {
        photos[photos.length - 1]!.next = photos[0];
      }

      if (videos[videos.length - 1] && videos[0]) {
        videos[videos.length - 1]!.next = videos[0];
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
