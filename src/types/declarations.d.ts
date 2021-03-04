declare module 'vite-plugin-react-svg';
declare module 'virtual-scroll';

declare const __DEV__: boolean;
declare const __PROD__: boolean;
declare const __ACC__: boolean;
declare const __TEST__: boolean;
declare const CMS_URL: string;

// extend window object
interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => () => void;
}
