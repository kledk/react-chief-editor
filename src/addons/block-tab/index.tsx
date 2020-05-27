import { AddonProps } from "../../addon";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";

export function BlockTabAddon(props: AddonProps) {
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
