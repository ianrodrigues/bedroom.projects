import * as i from 'types';
import { State } from 'zustand';

export interface AppState extends State {
  allMedia?: i.AllMedia;
  setAllMedia: (media: i.AllMedia) => void;

  photo?: i.APIPhotosObject;
  video?: i.APIMediaObject;
  setMedia: <T extends i.MediaType>(type: T, media: T extends 'photo' ? i.StatePhotoObject : i.StateVideoObject) => void;

  templates: i.PhotoDetailTemplates;
  setTemplates: (templates: i.PhotoDetailTemplates) => void;

  showName: boolean;
  setShowName: (showName: boolean) => void;

  isFullscreen: boolean;
  setFullscreen: (bool: boolean) => void;

  isMenuOpen: Record<i.Side, boolean>;
  setMenuOpen: (side: i.Side, open: boolean) => void;
  closeMenus: () => void;
  isAnyMenuOpen: () => boolean;

  videoPlayer: {
    isPlaying: boolean;
    setPlaying: (isPlaying: boolean) => void;
    isReady: boolean;
    setReady: (isReady: boolean) => void;
  };
}

export type PhotoDetailTemplate = [undefined, ...i.Layout[][]];

export interface PhotoDetailTemplates {
  [slug: string]: i.PhotoDetailTemplate;
}

export interface AllMedia {
  photo: i.StatePhotoObject[];
  video: i.StateVideoObject[];
}

interface Thumbnail {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

interface LargeFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

interface MediumFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

interface SmallFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string;
  url: string;
}

interface Formats {
  thumbnail: Thumbnail;
  large?: LargeFormat;
  medium?: MediumFormat;
  small: SmallFormat;
}

export interface VideoMedia {
  id: number;
  name: string;
  /** @deprecated use alt_text from APIMediaObject */
  alternativeText: string;
  caption: string;
  width?: number;
  height?: number;
  formats: null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  created_at: Date;
  updated_at: Date;
}

export interface PhotoMedia {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  created_at: Date;
  updated_at: Date;
}

export interface Layout {
  id: number;
  bedroom_media: number;
  row_location: 'left' | 'middle' | 'right';
  display_type: 'single' | 'spaced' | 'fill' | 'together';
  offset_x_1: number;
  offset_y_1: number;
  scale_1: number;
  offset_x_2: number;
  offset_y_2: number;
  scale_2: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  media: PhotoMedia[];
  row_num: number;
}

export interface APIMediaObject {
  id: number;
  title: string;
  slug: string;
  description?: string;
  credits?: string;
  video_url?: string;
  created_at: Date;
  updated_at: Date;
  /** @deprecated For cover/poster use media_cover. For layout use APIPhotosObject.bedroom_media_layouts */
  media?: PhotoMedia[] | VideoMedia[];
  media_cover: PhotoMedia | VideoMedia;
  full_video?: VideoMedia;
  video_poster?: PhotoMedia;
}

export interface APIPhotosObject extends APIMediaObject {
  bedroom_media_layouts: Layout[];
}

export interface StatePhotoObject extends APIPhotosObject {
  next: StatePhotoObject;
}

export interface StateVideoObject extends APIMediaObject {
  next: APIMediaObject;
}
