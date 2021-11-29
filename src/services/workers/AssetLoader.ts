/* eslint-disable no-restricted-globals */
import * as i from 'types';


self.addEventListener('message', async (evt: MessageEvent<string>): Promise<void> => {
  const url = evt.data;

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const msg: i.AssetLoaderWorkerMessage = {
      url,
      blobUrl: URL.createObjectURL(blob),
    };

    self.postMessage(msg);
  } catch (e) {
    console.error(e);
  }
});
