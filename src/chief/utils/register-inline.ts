import { Element } from "slate";
import { OnPlugin } from "../../addon";

export function registerInlineType(
  validateType: string | ((element: Element) => boolean)
): OnPlugin["isInline"] {
  return (isInline) => (element) =>
    (typeof validateType === "string" && validateType === element.type) ||
    (typeof validateType === "function" && validateType(element))
      ? true
      : isInline(element);
}
