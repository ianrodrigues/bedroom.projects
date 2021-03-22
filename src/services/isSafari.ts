export function isSafari() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return isSafari;
}
