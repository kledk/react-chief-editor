import React from "react";
import { Editor as SlateEditor, Location } from "slate";
import { ReactEditor } from "slate-react";
import { ChiefEditor } from "../../typings";
export const handleKeyUp = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: ChiefEditor
) => {
  const { selection } = editor;
  if (!selection) {
    return;
  }
  const [, path] = SlateEditor.node(editor, selection as Location);
  if (!path.length) {
    return;
  }
  const [parent] = SlateEditor.parent(editor, path);
  if (parent) {
    // TODO: implement some kind of trigger
    // for (let addon of addons) {
    //   if (addon.triggers) {
    //     for (let trigger of plugin.triggers) {
    //       const matches = findMatches(trigger.pattern, trigger.range, editor);
    //       if (matches.length) {
    //         plugin.onTrigger && plugin.onTrigger(editor, matches, trigger);
    //         return;
    //       }
    //     }
    //   }
    // }
  }
};
