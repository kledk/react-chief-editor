import { useEffect } from "react";
import { useChief } from "./use-chief";
import { KeyHandler } from "../key-handler";
/**
 * Respond to onKeyDown events in the editor.
 * If you want to receive all onKeyDown events, you can leave out the pattern.
 * For responding to certain key down combos, you can specify a key pattern, eg. "mod+b".
 * @param handler Function to call when a key or combo is pressed
 * @param overrides
 * @param deps
 */

export function useOnKeyDown(handler: KeyHandler, deps: any[] = []) {
  const chief = useChief();
  useEffect(() => {
    if (handler.pattern !== null) {
      chief.injectOnKeyHandler(handler);
    }
    return () => chief.removeOnKeyHandler(handler);
  }, deps);
}
