import * as i from 'types';
import { State } from 'zustand';

export interface AppState extends State {
  allMedia?: i.AllMedia;
  setAllMedia: (media: i.AllMedia) => void;

  photo?: i.APIPhotosObject;
  video?: i.APIMediaObject;
  setMedia: <T extends i.MediaType>(type: T, media: T extends 'photo' ? i.APIPhotosObject : i.APIMediaObject) => void;

  templates: i.PhotoDetailTemplates;
  setTemplates: (templates: i.PhotoDetailTemplates) => void;

  showName: boolean;
  setShowName: (showName: boolean) => void;

  isFullscreen: boolean;
  setFullscreen: (bool: boolean) => void;

  isMenuOpen: Record<i.Side, boolean>;
  setMenuOpen: (side: i.Side, open: boolean) => void;
  closeMenus: () => void;
}

export interface PhotoDetailTemplates {
  [slug: string]: [undefined, ...i.Layout[][]]
}

export interface AllMedia {
  photo: i.APIPhotosObject[];
  video: i.APIMediaObject[];
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
  alt_text: string;
  row_location: string;
  offset_x: number;
  offset_y: number;
  scale: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  media: PhotoMedia;
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
  media: PhotoMedia[] | VideoMedia[];
  media_cover: PhotoMedia | VideoMedia;
  full_video?: VideoMedia[];
}

export interface APIPhotosObject extends APIMediaObject {
  bedroom_media_layouts: Layout[];
}
