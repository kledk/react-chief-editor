import { ReactEditor } from "slate-react";
import { OnPlugin } from "../../addon";

// Use this to save the originals of the editor functions
let originalEntries = {};
/**
 * Allows for dynamically hook in and out of plugins.
 * Only overriding functions of the Editor is supported.
 * @param editor
 * @param addons
 */
export function withChiefOnPlugIn(editor: ReactEditor, plugins: OnPlugin[]) {
  // We basically take control over each funtion in the editor and route them
  // to the appropriate addon that has requested overriding it.
  for (const [prop, value] of Object.entries(editor)) {
    if (typeof value === "function") {
      if (!(prop in originalEntries)) {
        originalEntries[prop] = value;
      }
      editor[prop] = (...args: any[]) => {
        let fn = originalEntries[prop];
        for (const plugin of plugins) {
          if (plugin && prop in plugin) {
            fn = plugin && plugin[prop](fn, editor);
          }
        }
        return fn(...args);
      };
    }
  }

  return editor;
}
