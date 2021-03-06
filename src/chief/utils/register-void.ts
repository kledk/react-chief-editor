import { Element } from "slate";
import { OnPlugin } from "../../addon";

export function registerVoidType(
  validateType: string | ((element: Element) => boolean)
): OnPlugin["isVoid"] {
  return (isVoid) => (element) =>
    (typeof validateType === "string" && validateType === element.type) ||
    (typeof validateType === "function" && validateType(element))
      ? true
      : isVoid(element);
}
