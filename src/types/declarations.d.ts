declare module 'vite-plugin-react-svg';

declare module 'virtual-scroll' {
  class VirtualScroll {
    constructor(options: { mouseMultiplier: number });

    __private_3_event: { y: number };

    on(cb: (data: { y: number; deltaY: number }) => void): void;
    destroy(): void;
  }

  export default VirtualScroll;
}

declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __ACC__: boolean;
declare const __TEST__: boolean;
declare const CMS_URL: string;

// extend window object
interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => () => void;
}
