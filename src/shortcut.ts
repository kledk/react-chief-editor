import { toKeyName } from "is-hotkey";

export function shortcutText(shortcut: string) {
  return toKeyName(shortcut).replace("mod", "⌘").toUpperCase();
}
