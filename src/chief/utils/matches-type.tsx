import { ElementTypeMatch, ChiefElement } from "../chief";

export function matchesType(
  element: ChiefElement,
  typeMatch?: ElementTypeMatch
): element is ChiefElement {
  return (
    (Array.isArray(typeMatch) && typeMatch.includes(element.type)) ||
    (typeof typeMatch === "string" && typeMatch === element.type) ||
    Boolean(typeMatch instanceof RegExp && element.type.match(typeMatch))
  );
}
