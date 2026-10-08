export interface PreparedImage {
  src: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  pageNumber?: number;
}
export interface PreparedAsset {
  sourceSha256: string;
  sourceBytes: number;
  sourcePages?: number;
  images: PreparedImage[];
}
