import { Addon } from "../../addon";
import { ReactEditor } from "slate-react";
import { Editor, Transforms } from "slate";
import { useCreateAddon } from "../../chief/chief";

export const ResetToParagraphAddonImpl: Addon = {
  onPlugin: {
    deleteBackward: (deleteBackward, editor) => unit => {
      const [isParagraph] = Editor.nodes(editor, {
        match: n => n.type === "paragraph"
      });
      if (
        !isParagraph &&
        editor.selection &&
        editor.selection.focus.offset === 0
      ) {
        return Transforms.setNodes(editor, { type: "paragraph" });
      }
      return deleteBackward(unit);
    }
  }
};

export function ResetToParagraphAddon(props: Addon) {
  useCreateAddon(ResetToParagraphAddonImpl, props);
  return null;
}
