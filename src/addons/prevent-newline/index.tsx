import { AddonProps } from "../../addon";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { Range } from "slate";

export function PreventNewlineAddon(props: AddonProps) {
  useOnKeyDown({
    pattern: "enter+shift",
    handler: (event, editor) => {
      if (editor.selection && Range.isCollapsed(editor.selection)) {
        event.preventDefault();
        event.stopPropagation();
        editor.insertText("\n");
        return true;
      }
      return false;
    }
  });
  return null;
}
