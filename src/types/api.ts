import * as i from 'types';


type Slug = string;

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
  provider_metadata?: unknown;
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
  provider_metadata?: unknown;
  created_at: Date;
  updated_at: Date;
}

export type ImgAttributeIndices = 1 | 2;
export type ImgAttribute =
 | `offset_x_${ImgAttributeIndices}`
 | `offset_y_${ImgAttributeIndices}`
 | `scale_${ImgAttributeIndices}`;
export type ImgAttributes = Record<ImgAttribute, number>;

export interface Layout extends ImgAttributes {
  id: number;
  bedroom_media: number;
  row_location: 'left' | 'middle' | 'right';
  display_type: 'single' | 'spaced' | 'fill' | 'together';
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
  slug: Slug;
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
  list_num: number;
}

export interface APIPhotosObject extends APIMediaObject {
  bedroom_media_layouts: Layout[];
}

export interface StatePhotoObject extends APIPhotosObject {
  next: Slug;
}

export interface StateVideoObject extends APIMediaObject {
  next: Slug;
  video_poster: PhotoMedia;
}

export interface APIInfoObject {
  id: number;
  description: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  image: i.PhotoMedia;
  title: string;
}
