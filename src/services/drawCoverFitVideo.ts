import { isSafari } from './isSafari';


export function drawCoverFitVideo(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  x = 0,
): void {
  const vidW = video.videoWidth;
  const vidH = video.videoHeight;
  const scale = Math.min(ctx.canvas.width / vidW, ctx.canvas.height / vidH);

  let nw = video.videoWidth * scale;
  let nh = video.videoHeight * scale;
  let sx, sw, sh, scale2 = 1;

  // Decide which gap to fill
  if (nw < ctx.canvas.width) {
    scale2 = ctx.canvas.width / nw;
  }

  if (Math.abs(scale2 - 1) < 1e-14 && nh < ctx.canvas.height) {
    scale2 = ctx.canvas.height / nh;
  }

  nw *= scale2;
  nh *= scale2;

  // Calc source rectangle
  sw = video.videoWidth / (nw / ctx.canvas.width);
  sh = video.videoHeight / (nh / ctx.canvas.height);
  sx = (sw / nw) * x;

  // Safari has a bug with drawing out of bound
  if (isSafari()) {
    x = 0;
    sx = 0;
  }

  // Make sure source rectangle is valid
  if (sx < 0) sx = 0;
  if (sw > video.videoWidth) sw = video.videoWidth;
  if (sh > video.videoHeight) sh = video.videoHeight;

  ctx.drawImage(video, sx, 0, sw, sh, x, 0, ctx.canvas.width, ctx.canvas.height);
}
