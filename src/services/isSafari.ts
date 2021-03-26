export function isSafari(): boolean {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return isSafari;
}
