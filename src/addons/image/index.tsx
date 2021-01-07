import {} from "./image-element";
import { ChiefElement, isChiefElement } from "../../chief/chief";
import isUrl from "is-url";
import { ImageExtensions } from "./ImageExtensions";

export { ImageAddon } from "./image-addon";
export { ImageControl } from "./image-control";
export interface ImageElement extends ChiefElement {
  type: "image";
  url: string | null;
  caption?: string;
  previewId?: number;
  width: number;
  height: number;
  align: "left" | "center" | "right";
}

export function isImageElement(element: unknown): element is ImageElement {
  return isChiefElement(element) && element.type === "image";
}

export const isImageUrl = (url: string, extensions = ImageExtensions) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop() as string;
  return extensions.includes(ext);
};
