export function drawCoverFitImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x = 0, y = 0,
  width = 0, height = 0,
  offsetX = 0.5, offsetY = 0.5,
): void {
  if (!width && !height) {
    width = ctx.canvas.width;
    height = ctx.canvas.height;
  }

  // Keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  // New size
  const scale = Math.min(width / img.width, height / img.height);
  let nw = img.width * scale;
  let nh = img.height * scale;
  let cx, cy, cw, ch, scale2 = 1;

  // Decide which gap to fill
  if (nw < width) {
    scale2 = width / nw;
  }

  if (Math.abs(scale2 - 1) < 1e-14 && nh < height) {
    scale2 = height / nh;
  }

  nw *= scale2;
  nh *= scale2;

  // Calc source rectangle
  cw = img.width / (nw / width);
  ch = img.height / (nh / height);

  cx = (img.width - cw) * offsetX;
  cy = (img.height - ch) * offsetY;

  // Make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > img.width) cw = img.width;
  if (ch > img.height) ch = img.height;

  // Draw on canvas
  ctx.drawImage(img, cx, cy, cw, ch, x, y, width, height);
}
