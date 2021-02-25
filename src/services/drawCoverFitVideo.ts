export function drawCoverFitVideo(ctx: CanvasRenderingContext2D, video: HTMLVideoElement): void {
  const vidW = video.videoWidth;
  const vidH = video.videoHeight;
  const scale = Math.min(ctx.canvas.width / vidW, ctx.canvas.height / vidH);
  const top = ctx.canvas.height / 2 - (vidH / 2) * scale;
  const left = ctx.canvas.width / 2 - (vidW / 2) * scale;

  ctx.drawImage(video, left, top, vidW * scale, vidH * scale);
}
