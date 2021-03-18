export function drawCoverFitImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width = 0, height = 0,
  x = 0, y = 0,
  offsetX = 0, offsetY = 0,
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
  const scale = Math.min(ctx.canvas.width / img.width, height / img.height);
  let nw = img.width * scale;
  let nh = img.height * scale;
  let sx, sy, sw, sh, scale2 = 1;

  // Decide which gap to fill
  if (nw < ctx.canvas.width) {
    scale2 = ctx.canvas.width / nw;
  }

  if (Math.abs(scale2 - 1) < 1e-14 && nh < height) {
    scale2 = height / nh;
  }

  nw *= scale2;
  nh *= scale2;

  // Calc source rectangle
  sw = img.width / (nw / width);
  sh = img.height / (nh / height);
  sx = (img.width - sw) * offsetX;
  sy = (img.height - sh) * offsetY;

  // Make sure source rectangle is valid
  if (sx < 0) sx = 0;
  if (sy < 0) sy = 0;
  if (sw > img.width) sw = img.width;
  if (sh > img.height) sh = img.height;

  // Check if we can center the image on y-axis
  const diff = nh - window.innerHeight;
  if (diff > 0) {
    sy = diff / 2;
  }

  // Draw on canvas
  ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height);
}
