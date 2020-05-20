import { Addon } from "../../addon";
import { useOnKeyDown } from "../../chief/chief";

export function BlockTabAddon(props: Addon) {
  useOnKeyDown({
    pattern: "tab",
    priority: "low",
    handler: e => {
      e.preventDefault();
      return true;
    }
  });
  return null;
}
