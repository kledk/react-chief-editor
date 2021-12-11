import { Element } from "slate";
import { OnPlugin } from "../../addon";
import { CustomElement } from "../../typings";
import { ChiefElement } from "../chief";

export function registerVoidType<T extends Element = Element>(
  validateType: string | ((element: T) => boolean)
): OnPlugin["isVoid"] {
  return (isVoid) => (element) =>
    (typeof validateType === "string" && validateType === element.type) ||
    (typeof validateType === "function" && validateType(element))
      ? true
      : isVoid(element);
}
