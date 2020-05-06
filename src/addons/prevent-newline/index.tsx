import { Addon } from "../../addon";

export const PreventNewlineAddon: Addon = {
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
