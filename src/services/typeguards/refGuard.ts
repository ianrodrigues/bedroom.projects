import { ForwardedRef, MutableRefObject } from 'react';

export function isRef<T extends HTMLElement>(ref: ForwardedRef<T>): ref is MutableRefObject<T> {
  return ref != null && 'current' in ref;
}
