/// <reference types="resize-observer-browser" />

import { isSafari } from './isSafari';

type OnFn = (scrollY: number, containerBody: HTMLDivElement, bottomEdge: number) => void;

type Elements = {
  container: HTMLDivElement | null;
  containerBody: HTMLDivElement | null;
  hitbox: HTMLDivElement | null;
  scrollContainers: NodeListOf<HTMLDivElement> | null;
  scrollers: NodeListOf<HTMLDivElement> | null;
}

export class SmoothScroll {
  $: Elements = {
    container: null,
    containerBody: null,
    hitbox: null,
    scrollContainers: null,
    scrollers: null,
  }

  params = {
    containerHeight: 0,
    duration: 1000,
    timingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }

  private onFn?: () => void;

  constructor(_containerSelector: string) {
    // Init DOM elements
    this.$ = {
      container: document.querySelector<HTMLDivElement>(_containerSelector),
      containerBody: document.querySelector<HTMLDivElement>(_containerSelector + '__body'),
      hitbox: document.querySelector<HTMLDivElement>(_containerSelector + '--hitbox'),
      scrollContainers: document.querySelectorAll<HTMLDivElement>('[data-scroll-container]'),
      scrollers: document.querySelectorAll<HTMLDivElement>('[data-scroll]'),
    };

    this.initStyle();
    this.initListeners();
  }

  destroy = (): void => {
    window.removeEventListener('scroll', this.handleScroll);

    if (this.onFn) {
      window.removeEventListener('scroll', this.onFn);
    }
  }

  on = (cb: OnFn): void => {
    this.onFn = () => {
      cb(window.scrollY, this.$.containerBody!, this.$.hitbox!.offsetHeight);
    };

    window.addEventListener('scroll', this.onFn);
  }

  private initStyle = (): void => {
    // Set container style
    this.$.container!.style.overflow = 'hidden';
    this.$.container!.style.position = 'fixed';
    this.$.container!.style.height = '100vh';

    // Set containerBody style
    this.$.containerBody!.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;

    // Add transtion after scroll to
    const addTransition = () => {
      // Set currentTranslateY
      const regex = /\s?([,])\s?/;
      const splitTransform = getComputedStyle(this.$.containerBody!).transform.split(regex);
      const currentTranslateY = parseInt(splitTransform[splitTransform.length - 1]!);

      if (-currentTranslateY !== window.scrollY) {
        setTimeout(() => {
          addTransition();
        }, 10);
      } else {
        // Add transition
        if (!isSafari()) {
          this.$.containerBody!.style.transition = `transform ${this.params.duration}ms ${this.params.timingFunction}`;

          this.loopScrollers((el) => {
            el.style.transition = `transform ${this.params.duration}ms ${this.params.timingFunction}`;
          });
        }
      }
    };

    // Run addTranstion
    addTransition();

    const observer = new ResizeObserver(() => {
      this.setHitboxHeight();
    });

    observer.observe(this.$.containerBody!);

    this.loopScrollContainers((el) => {
      observer.observe(el);
    });

    this.setHitboxHeight();
  }

  private initListeners = (): void => {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.setHitboxHeight);
  }

  private handleScroll = (): void => {
    this.$.containerBody!.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;
  }

  private setHitboxHeight = (): void => {
    let heightFromContainers = this.$.containerBody!.offsetHeight;

    this.loopScrollContainers((el) => {
      heightFromContainers += el.offsetHeight;
    });

    this.$.hitbox!.style.height = `${heightFromContainers}px`;
  }

  private loopScrollContainers = (cb: (el: HTMLDivElement) => void): void => {
    if (this.$.scrollContainers) {
      for (const el of this.$.scrollContainers) {
        cb(el);
      }
    }
  }

  private loopScrollers = (cb: (el: HTMLDivElement) => void): void => {
    if (this.$.scrollers) {
      for (const el of this.$.scrollers) {
        cb(el);
      }
    }
  }
}
