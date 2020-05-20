import { Editor, Transforms, Range } from "slate";
import { usePlugin } from "../../chief/chief";

export function ResetToParagraphAddon() {
  usePlugin({
    deleteBackward: (deleteBackward, editor) => (...args) => {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        const [parent, path] = Editor.parent(editor, selection);
        const isParagraph = parent.type === "paragraph";
        if (
          path.length === 1 &&
          !isParagraph &&
          selection &&
          selection.focus.offset === 0
        ) {
          return Transforms.setNodes(editor, { type: "paragraph" });
        }
      }
      return deleteBackward(...args);
    }
  });
  return null;
}
