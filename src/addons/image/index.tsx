import React from "react";
import { Addon } from "../../addon";
import { Element, Editor, Transforms, Path, NodeEntry } from "slate";
import {
  useFocused,
  useSelected,
  RenderElementProps,
  ReactEditor
} from "slate-react";
import { StyledToolbarBtn } from "../../StyledToolbarBtn";
import { isNodeActive } from "../../utils";
import { RichEditor } from "../../editor";
import { ToolbarBtn } from "../../ToolbarBtn";

export interface AElement extends Element {
  type: string;
}

export function isAElement(element: unknown): element is AElement {
  return typeof (element as AElement).type !== "undefined";
}

export interface ImageElement extends AElement {
  type: "image";
  url: string;
  caption: string;
}

export function isImageElement(element: unknown): element is ImageElement {
  return isAElement(element) && element.type === "image";
}

export const Image = (props: RenderElementProps) => {
  const focused = useFocused();
  const selected = useSelected();
  const { element } = props;
  if (!isImageElement(element)) {
    return null;
  }
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
          alt={element.caption}
          src={element.url}
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
      return isAElement(element) && element.type === "image"
        ? true
        : isVoid(element);
    };

    // TODO
    editor.normalizeNode = (entry: NodeEntry) => {
      const [node, path] = entry;
      if (isImageElement(node)) {
        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            children: [{ text: "" }]
          },
          { at: Path.next(path) }
        );
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
      return <ToolbarBtn>Delete</ToolbarBtn>;
    }
  },
  blockInsertMenu: {
    order: 1,
    category: "image",
    renderButton: editor => {
      return (
        <ToolbarBtn
          isActive={isNodeActive(editor, "image")}
          onClick={() => {
            RichEditor.insertBlock(editor, "image");
            ReactEditor.focus(editor);
          }}
        >
          Image
        </ToolbarBtn>
      );
    }
  }
};
