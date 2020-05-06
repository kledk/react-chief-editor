import React from "react";
import { Addon } from "../../addon";
import { Element, Editor, Transforms, Path, NodeEntry } from "slate";
import { useFocused, useSelected, RenderElementProps } from "slate-react";

export const isImageELement = (element: Element) => {
  return element.type === "image" && typeof element.url === "string";
};

export const Image = (props: RenderElementProps) => {
  const focused = useFocused();
  const selected = useSelected();
  return (
    <div {...props.attributes}>
      <div contentEditable={false}>
        <img
          style={{
            objectFit: "cover",
            width: "100%",
            display: "block",
            height: 400,
            outline:
              focused && selected ? "1px solid rgb(46, 170, 220)" : "none"
          }}
          alt={props.element.caption as string}
          src={props.element.url as string}
        ></img>
        {props.children}
      </div>
    </div>
  );
};

export const ImageAddon: Addon = {
  name: "image",
  element: {
    typeMatch: /image/,
    renderElement: props => {
      return <Image {...props} />;
    }
  },
  withPlugin: <T extends Editor>(editor: T): T => {
    const { isVoid, normalizeNode } = editor;

    editor.isVoid = (element: Element) => {
      return element.type === "image" ? true : isVoid(element);
    };

    // TODO
    editor.normalizeNode = (entry: NodeEntry) => {
      const [node, path] = entry;
      if (Element.isElement(node) && node.type === "image") {
        let previous = Editor.previous(editor, { at: path });
        if (previous) {
          const [previousNode, previousPath] = previous;
          if (Element.isElement(previousNode) && editor.isVoid(previousNode)) {
            Transforms.insertNodes(
              editor,
              {
                type: "paragraph",
                children: [{ text: "1" }]
              },
              { at: Path.next(previousPath) }
            );
          }
        }
        let next = Editor.next(editor, { at: path });
        if (next) {
          const [nextNode, nextPath] = next;
          if (Element.isElement(nextNode) && editor.isVoid(nextNode)) {
            Transforms.insertNodes(
              editor,
              {
                type: "paragraph",
                children: [{ text: "2" }]
              },
              { at: Path.next(nextPath) }
            );
          }
        } else {
          Transforms.insertNodes(
            editor,
            {
              type: "paragraph",
              children: [{ text: "3" }]
            },
            { at: Path.next(path) }
          );
        }
      } else {
        normalizeNode(entry);
      }
    };

    return editor;
  },
  hoverMenu: {
    order: 1,
    category: "image",
    typeMatch: /image/,
    renderButton: () => {
      return <span>Delete</span>;
    }
  }
};
