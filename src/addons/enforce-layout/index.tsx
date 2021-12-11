import { useEffect } from "react";
import {
  BaseElement,
  Descendant,
  Editor,
  Element,
  Node,
  Path,
  Range,
  Text,
  Transforms,
} from "slate";
import { useSlate, useSlateStatic } from "slate-react";
import element from "slate-react/dist/components/element";
import { useOnKeyDown, usePlugin } from "../../chief";
import { getActiveNode, getNode } from "../../utils";

export type EnforcedLayout = {
  path: Path;
  element: { type: string };
};

export function EnforceLayoutAddon(props: { layout: EnforcedLayout[] }) {
  const { layout } = props;
  const editor = useSlate();
  
  useEffect(() => Editor.normalize(editor, { force: true }), [layout]);
  usePlugin({
    normalizeNode: (normalizeNode, editor) => ([currentNode, currentPath]) => {
      const endCurrentNormalizationPass = layout.some(
        ({ path, element }, index, layout) => {
          // console.log(path, currentPath);
          for (const [child, childPath] of Node.nodes(editor)) {
            if (
              Element.isElement(child) &&
              !layout.some((it) => Path.equals(it.path, childPath))
            ) {
              console.log("delete", child);
              Transforms.delete(editor, {
                at: childPath,
              });
              return true;
            }
          }
          console.log(path);
          const node = getNode(editor, path);
          if (node) {
            if (Element.isElement(node) && node.type !== element.type) {
              console.log("set", element);
              Transforms.setNodes(
                editor,
                { ...element },
                {
                  at: path,
                }
              );
              return true;
            }
          }
          if (Text.isText(node)) {
            console.log("insert", element);
            Transforms.insertNodes(
              editor,
              { ...element, children: [{ text: "" }] },
              {
                at: path,
              }
            );
            return true;
          }
          if (node === null) {
            Transforms.insertNodes(
              editor,
              { ...element, children: [{ text: "" }] },
              {
                at: path,
              }
            );
            return true;
          }

          return false;
        }
      );

      if (endCurrentNormalizationPass) {
        return;
      }

      return normalizeNode([currentNode, currentPath]);
    },
    deleteForward: (deleteForward) => (unit) => {
      deleteForward(unit);
    },
    deleteBackward: (deleteBackward, editor) => (unit) => {
      const { selection } = editor;
      // console.log(unit);
      if (selection) {
        const [node, path] = Editor.node(editor, selection);
        // console.log(path);
      }
      deleteBackward(unit);
    },
    deleteFragment: (deleteFragment) => (...args) => {
      console.log("deleteFragment", ...args);
      deleteFragment(...args);
    },
    apply: (apply) => (op) => {
      console.log(op.type, "path" in op ? op.path : "", op);

      const isNormalizing = Editor.isNormalizing(editor);
      if (isNormalizing) {
        console.log("apply, is normalizing");
        apply(op);
      } else {
        if (
          !["merge_node", "insert_node", "split_node", "remove_node"].includes(
            op.type
          )
        ) {
          apply(op);
        } else if (
          op.type === "insert_node" &&
          layout.some((it) => Path.equals(it.path, op.path))
        ) {
          apply(op);
        } else if (
          op.type === "merge_node" &&
          !layout.some((it) => Path.equals(it.path, op.path))
        ) {
          apply(op);
        } else if (
          op.type === "split_node" &&
          !layout.some((it) => Path.equals(it.path, op.path))
        ) {
          apply(op);
        } else if (
          op.type === "remove_node" &&
          !layout.some((it) => Path.equals(it.path, op.path))
        ) {
          apply(op);
        } else {
          console.log("Ignored operation", op.type);
        }
      }
    },
  });

  return null;
}
