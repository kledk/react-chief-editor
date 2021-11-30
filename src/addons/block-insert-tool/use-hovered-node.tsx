import { useState, useEffect } from "react";
import { ReactEditor } from "slate-react";
import { Node, Editor, Path } from "slate";

export function useHoveredNode(editor: Editor) {
  const [node, setNode] = useState<{ node: Node; path: Path } | null>(null);
  useEffect(() => {
    try {
      const [rootNode] = Editor.node(editor, {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      });
      if (rootNode && Node.isNode(rootNode)) {
        const firstDOMPoint = ReactEditor.toDOMNode(editor, rootNode);
        firstDOMPoint.addEventListener("mousemove", (e) => {
          if (ReactEditor.hasDOMNode(editor, e.target as globalThis.Node)) {
            const node = ReactEditor.toSlateNode(
              editor,
              e.target as globalThis.Node
            );
            const path = ReactEditor.findPath(editor, node);
            setNode({ node, path });
          } else {
            setNode(null);
          }
        });
      }
    } catch (err) {
      setNode(null);
    }
  }, [editor]);
  return node;
}
