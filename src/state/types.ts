import { State } from 'zustand';

export interface AppState extends State {
  allMedia?: AllMedia;
  setAllMedia: (media: AllMedia) => void;

  photo?: APIMediaObject;
  video?: APIMediaObject;
  setMedia: (type: MediaType, media: APIMediaObject) => void;

  showName: boolean;
  setShowName: (showName: boolean) => void;

  isFullscreen: boolean;
  setFullscreen: (bool: boolean) => void;
}

export type MediaType = 'photo' | 'video';
export type AllMedia = Record<MediaType, APIMediaObject[]>;

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
