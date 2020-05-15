import React, { useRef, useState, useCallback } from "react";
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
import { useCreateAddon, useRenderElement, useOnKey } from "../../chief/chief";
import { ElementWrapper } from "../../element-wrapper";
import { StyledToolBox, StyledToolBase } from "../../StyledToolBox";
import { StyledToolbarBtn } from "../../StyledToolbarBtn";
import { ToolsWrapper } from "../../ToolsWrapper";
import { Button } from "../../Button";

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
  previewId?: number;
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

const StyledFocusToolbar = styled(StyledToolBase)`
  background-color: transparent;
  ${Button} {
    background-color: rgba(47, 47, 47, 0.77);
    &:hover {
      background-color: rgba(67, 67, 67, 0.77);
    }
    font-size: 0.8em;
    color: white;
    border: none;
    &:first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    &:last-child {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    padding: 4px 8px;
    margin: 0 1px;
  }
`;

export const Image = (
  props: RenderElementProps & {
    onOpenFileRequest: () => void;
    previewData: string[];
  }
) => {
  const focused = useFocused();
  const selected = useSelected();
  const editor = useSlate();
  const { onOpenFileRequest, previewData, ...renderElementProps } = props;
  const { element, children, attributes } = renderElementProps;
  if (!isImageElement(element)) {
    return null;
  }

  const handleDelete = useCallback(() => {
    Transforms.delete(editor, { at: ReactEditor.findPath(editor, element) });
  }, [element]);

  const handleReplace = useCallback(() => {
    onOpenFileRequest();
  }, []);

  if (element.url || typeof element.previewId === "number") {
    const src = element.url
      ? element.url
      : typeof element.previewId === "number"
      ? props.previewData[element.previewId]
      : "";
    return (
      <ElementWrapper
        {...renderElementProps}
        attentionChildren={
          <StyledFocusToolbar>
            <ToolsWrapper>
              <Button onClick={handleDelete}>Delete</Button>
              <Button onClick={handleReplace}>Replace</Button>
            </ToolsWrapper>
          </StyledFocusToolbar>
        }
        style={{ right: 0, marginTop: 5, marginRight: 5 }}
      >
        <div>
          <div contentEditable={false}>
            <img
              {...attributes}
              style={{
                objectFit: "cover",
                width: "100%",
                display: "block",
                height: 400,
                outline:
                  focused && selected ? "1px solid rgb(46, 170, 220)" : "none"
              }}
              alt={element.caption}
              src={src}
            ></img>
            {children}
          </div>
        </div>
      </ElementWrapper>
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
  props: Addon & {
    onUploadRequest?: (files: globalThis.FileList | null) => Promise<string>;
  }
) {
  const editor = useSlate();
  const [previewData, setPreviewData] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const onPreview = (dataUrl: FileReader["result"]) => {
    if (typeof dataUrl === "string") {
      setPreviewData(d => {
        const _d = [...d];
        const currentPreviewId = _d.push(dataUrl) - 1;
        Transforms.setNodes(editor, {
          url: null,
          previewId: currentPreviewId
        });
        return _d;
      });
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor.selection) {
      return;
    }
    const imageRef = Editor.rangeRef(editor, editor.selection);
    const onUploadedSuccess = (url: string) => {
      if (!imageRef.current) return;
      Transforms.setNodes(
        editor,
        {
          url: url,
          previewId: undefined
        },
        { at: imageRef.current }
      );
      imageRef.unref();
    };
    const onUploadedFailed = () => {
      if (!imageRef.current) return;
      Transforms.setNodes(
        editor,
        {
          url: null,
          previewId: undefined
        },
        { at: imageRef.current }
      );
      imageRef.unref();
    };
    const files = e.target.files;
    if (!files) {
      return;
    }
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => onPreview(reader.result));
      reader.readAsDataURL(file);
      if (props.onUploadRequest) {
        try {
          const url = await props.onUploadRequest(files);
          onUploadedSuccess(url);
        } catch (err) {
          onUploadedFailed();
        }
      }
    }
  };

  const { addon } = useCreateAddon(ImageAddonImpl, props);

  useRenderElement(
    {
      typeMatch: /image/,
      renderElement: props => (
        <Image
          previewData={previewData}
          onOpenFileRequest={() => fileRef.current && fileRef.current.click()}
          {...props}
        />
      )
    },
    props,
    [previewData]
  );

  return <FileUpload ref={fileRef} onChange={handleFile} multiple={false} />;
}
