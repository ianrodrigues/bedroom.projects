/* eslint-disable no-restricted-globals */
import * as i from 'types';


self.addEventListener('message', async (evt: MessageEvent<string>): Promise<void> => {
  const url = evt.data;

  try {
    // Start downloading image and wait for it to be done
    await fetch(url);

    const msg: i.AssetLoaderWorkerMessage = {
      url,
    };

    // Send message to event handlers
    self.postMessage(msg);
  } catch (e) {
    console.error(e);
  }
});
