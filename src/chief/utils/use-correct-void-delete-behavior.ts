import { Node, Range, Path, Editor as SlateEditor, Transforms } from "slate";
import { useSlate } from "slate-react";
import { usePlugin } from "../hooks/use-plugin";

export function useCorrectVoidDeleteBehavior() {
  const editor = useSlate();
  usePlugin({
    insertBreak: insertBreak => () => {
      if (!editor.selection || !Range.isCollapsed(editor.selection))
        return insertBreak();

      const selectedNodePath = Path.parent(editor.selection.anchor.path);
      const selectedNode = Node.get(editor, selectedNodePath);
      if (SlateEditor.isVoid(editor, selectedNode)) {
        SlateEditor.insertNode(editor, {
          type: "paragraph",
          children: [{ text: "" }]
        });
        return;
      }

      insertBreak();
    },
    deleteBackward: deleteBackward => unit => {
      if (
        !editor.selection ||
        !Range.isCollapsed(editor.selection) ||
        editor.selection.anchor.offset !== 0
      )
        return deleteBackward(unit);
      const prevNodePath = Path.previous(
        Path.parent(editor.selection.anchor.path)
      );
      const prevNode = Node.get(editor, prevNodePath);
      if (SlateEditor.isVoid(editor, prevNode)) {
        return Transforms.removeNodes(editor);
      }
      deleteBackward(unit);
    }
  });
}
