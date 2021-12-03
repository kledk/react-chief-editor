import {
  BaseElement,
  Editor,
  Element,
  Node,
  Path,
  Range,
  Transforms,
} from "slate";
import { useOnKeyDown, usePlugin } from "../../chief";
import { getActiveNode } from "../../utils";

export type EnforcedLayout = {
  type: string;
  children?: EnforcedLayout[];
};

export function EnforceLayoutAddon(props: { layout: EnforcedLayout[] }) {
  const { layout } = props;
  usePlugin({
    normalizeNode: (normalizeNode, editor) => ([node, path]) => {
      if (path.length === 0) {
        layout.forEach((block, index) => {
          if (editor.children.length < index + 1) {
            const node = {
              type: block.type,
              children: [{ text: "" }],
            };
            Transforms.insertNodes(editor, node, {
              at: path.concat(editor.children.length - 1),
            });
          }
        });

        for (const [child, childPath] of Node.children(editor, path)) {
          const slateIndex = childPath[0];
          const enforceType = (type: string) => {
            if (Element.isElement(child) && child.type !== type) {
              const newProperties: Partial<Element> = { type };
              Transforms.setNodes<Element>(editor, newProperties, {
                at: childPath,
              });
            }
          };
          const deleteNode = () => {
            if (Element.isElement(child)) {
              Transforms.delete(editor, {
                at: childPath,
              });
            }
          };

          if (layout[slateIndex]) {
            enforceType(layout[slateIndex].type);
          } else {
            deleteNode();
          }
        }
      }

      return normalizeNode([node, path]);
    },
    deleteForward: (deleteForward) => (unit) => {
      deleteForward(unit);
    },
    deleteBackward: (deleteBackward, editor) => (unit) => {
      const { selection } = editor;
      console.log(unit);
      if (selection) {
        const [node, path] = Editor.node(editor, selection);
        console.log(path);
      }
      deleteBackward(unit);
    },
    deleteFragment: (deleteFragment) => (...args) => {
      console.log("deleteFragment", ...args);
      deleteFragment(...args);
    },
    apply: (apply) => (op) => {
      console.log(op.type, "path" in op ? op.path : "", op);
      if (
        !["merge_node", "insert_node", "split_node", "remove_node"].includes(
          op.type
        )
      ) {
        apply(op);
      } else if (op.type === "insert_node" && op.path.length > 1) {
        apply(op);
      } else if (op.type === "merge_node" && op.path.length > 1) {
        apply(op);
      } else if (op.type === "split_node" && op.path.length > 1) {
        apply(op);
      } else if (op.type === "remove_node" && op.path.length > 1) {
        apply(op);
      } else {
        console.log("Ignored operation", op.type);
      }
    },
  });

  return null;
}
