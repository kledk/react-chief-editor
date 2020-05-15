import React, { useRef } from "react";
import { Addon } from "../../addon";
import { Element, Editor, Transforms, Path, NodeEntry } from "slate";
import {
  useFocused,
  useSelected,
  RenderElementProps,
  ReactEditor,
  useSlate
} from "slate-react";
import { isNodeActive } from "../../utils";
import { RichEditor } from "../../editor";
import { FileUpload } from "../../FileUpload";
import { ToolbarBtn } from "../../ToolbarBtn";
import styled from "styled-components";
import { useCreateAddon, useRenderElement } from "../../chief/chief";

export interface AElement extends Element {
  type: string;
}

export function isAElement(element: unknown): element is AElement {
  return typeof (element as AElement).type !== "undefined";
}

export interface ImageElement extends AElement {
  type: "image";
  url: string | null;
  caption: string;
}

export function isImageElement(element: unknown): element is ImageElement {
  return isAElement(element) && element.type === "image";
}

const StyledImageEmptyContainer = styled.div`
  background-color: ${props => props.theme.colors.gray[300]};
  &:hover {
    background-color: ${props => props.theme.colors.gray[200]};
  }
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  h2 {
    color: ${props => props.theme.colors.gray[600]};
    user-select: none;
  }
`;

export const Image = (
  props: RenderElementProps & { onOpenFileRequest: () => void }
) => {
  const focused = useFocused();
  const selected = useSelected();
  const { element } = props;
  if (!isImageElement(element)) {
    return null;
  }

  if (element.url) {
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
  } else {
    return (
      <div {...props.attributes} contentEditable={false}>
        <StyledImageEmptyContainer onClick={props.onOpenFileRequest}>
          <h2>Add an image</h2>
          {props.children}
        </StyledImageEmptyContainer>
      </div>
    );
  }
};

export const ImageAddonImpl: Addon<{ name: string }, {}> = {
  name: "image",
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
    renderButton: (editor, addon) => {
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

export function ImageAddon(
  props: Addon & { onUpload?: (files: globalThis.FileList | null) => void }
) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    props.onUpload && props.onUpload(files);
  };

  const { addon } = useCreateAddon(ImageAddonImpl, props);

  useRenderElement(
    {
      typeMatch: /image/,
      renderElement: props => (
        <Image
          onOpenFileRequest={() => fileRef.current && fileRef.current.click()}
          {...props}
        />
      )
    },
    props
  );

  return <FileUpload ref={fileRef} onChange={handleFile} multiple={false} />;
}
