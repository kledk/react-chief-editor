import { Addon } from "../../addon";
import { ReactEditor } from "slate-react";
import { Editor, Transforms } from "slate";

export const ResetToParagraphAddon: Addon = {
  withPlugin: <T extends ReactEditor>(editor: T): T => {
    const { deleteBackward } = editor;

    editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
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
    };

    return editor;
  }
};
