import { Addon } from "../../addon";
import { useOnKey } from "../../chief/chief";

export function PreventNewlineAddon(props: Addon) {
  useOnKey(
    {
      pattern: "Enter+Shift",
      handler: (event, editor) => {
        event.preventDefault();
        editor.insertText("\n");
        return true;
      }
    },
    props
  );
  return null;
}
