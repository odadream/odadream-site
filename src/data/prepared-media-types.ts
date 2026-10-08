export interface PreparedImage {
  src: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
}
export interface PreparedAsset {
  sourceSha256: string;
  sourceBytes: number;
  images: PreparedImage[];
}
