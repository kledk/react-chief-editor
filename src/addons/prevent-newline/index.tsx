import { Addon } from "../../addon";
import { useCreateAddon } from "../../chief/chief";

export const PreventNewlineAddonImpl: Addon = {
  onKeyDown: (event, editor) => {
    if (event.keyCode === 13) {
      if (event.shiftKey) {
        editor.insertText("\n");
        event.preventDefault();
        return true;
      }
    }
    return false;
  }
};

export function PreventNewlineAddon(props: Addon) {
  useCreateAddon(PreventNewlineAddonImpl, props);
  return null;
}
