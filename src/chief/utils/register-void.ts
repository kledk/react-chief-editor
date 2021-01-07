import { Element } from "slate";
import { OnPlugin } from "../../addon";

export function registerVoidType(
  type: string,
  validate?: (element: Element) => boolean
): OnPlugin["isVoid"] {
  return (isVoid) => (element) =>
    element.type === type &&
    (typeof validate === "function" ? validate(element) : true)
      ? true
      : isVoid(element);
}
