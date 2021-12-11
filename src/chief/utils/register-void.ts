import { Element } from "slate";
import { OnPlugin } from "../../addon";

export function registerVoidType<T extends Element = Element>(
  validateType: string | ((element: T) => boolean)
): OnPlugin["isVoid"] {
  return (isVoid) => (element) =>
    (typeof validateType === "string" && validateType === element.type) ||
    // @ts-expect-error
    (typeof validateType === "function" && validateType(element))
      ? true
      : isVoid(element);
}
