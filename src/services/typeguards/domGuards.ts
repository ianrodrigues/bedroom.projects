export function isHTMLVideoElement(object: GlobalEventHandlers): object is HTMLVideoElement {
  return 'play' in object;
}
