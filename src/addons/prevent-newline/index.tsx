import { Addon } from "../../addon";
import { useOnKeyDown } from "../../chief/chief";
import { Range } from "slate";

export function PreventNewlineAddon(props: Addon) {
  useOnKeyDown(
    {
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
    },
    props
  );
  return null;
}
