export function drawCoverFitVideo(ctx: CanvasRenderingContext2D, video: HTMLVideoElement): void {
  const vidW = video.videoWidth;
  const vidH = video.videoHeight;
  const scale = Math.min(ctx.canvas.width / vidW, ctx.canvas.height / vidH);

  let nw = video.videoWidth * scale;
  let nh = video.videoHeight * scale;
  let cw, ch, scale2 = 1;

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
  cw = video.videoWidth / (nw / ctx.canvas.width);
  ch = video.videoHeight / (nh / ctx.canvas.height);

  // Make sure source rectangle is valid
  if (cw > video.videoWidth) cw = video.videoWidth;
  if (ch > video.videoHeight) ch = video.videoHeight;

  ctx.drawImage(video, 0, 0, cw, ch, 0, 0, ctx.canvas.width, ctx.canvas.height);
}
