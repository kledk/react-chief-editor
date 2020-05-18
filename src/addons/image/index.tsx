import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import { Addon } from "../../addon";
import {
  Element,
  Editor,
  Transforms,
  Path,
  NodeEntry,
  Range,
  Location
} from "slate";
import {
  useFocused,
  useSelected,
  RenderElementProps,
  ReactEditor,
  useSlate
} from "slate-react";
import { isNodeActive, getNodeFromSelection, findNodes } from "../../utils";
import { RichEditor } from "../../chief/editor";
import { FileUpload } from "../../FileUpload";
import { ToolbarBtn } from "../../ToolbarBtn";
import styled from "styled-components";
import {
  useCreateAddon,
  useRenderElement,
  useOnKeyDown
} from "../../chief/chief";
import { StyledToolBox } from "../../StyledToolBox";
import { StyledToolbarBtn } from "../../StyledToolbarBtn";
import { Button } from "../../Button";
import { isDefined, isFilled } from "ts-is-present";
import { WithAttentionToolbar } from "./StyledFocusToolbar";

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

export const Image = (
  props: RenderElementProps & {
    onOpenFileRequest?: () => void;
    onRemoved?: (url: string | null) => void;
    previewData: string[];
  }
) => {
  const focused = useFocused();
  const selected = useSelected();
  const editor = useSlate();
  const {
    onOpenFileRequest,
    onRemoved,
    previewData,
    ...renderElementProps
  } = props;
  const { element, children, attributes } = renderElementProps;
  if (!isImageElement(element)) {
    return null;
  }

  const handleDelete = useCallback(() => {
    onRemoved && onRemoved(element.url);
    Transforms.delete(editor, { at: ReactEditor.findPath(editor, element) });
  }, [element]);

  const handleReplace = useCallback(() => {
    onOpenFileRequest && onOpenFileRequest();
  }, []);

  if (element.url || typeof element.previewId === "number") {
    const src = element.url
      ? element.url
      : typeof element.previewId === "number"
      ? props.previewData[element.previewId]
      : "";
    return (
      <WithAttentionToolbar
        {...renderElementProps}
        btns={
          <React.Fragment>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleReplace}>Replace</Button>
          </React.Fragment>
        }
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
      </WithAttentionToolbar>
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
  onPlugin: {
    isVoid: isVoid => element => {
      return isAElement(element) && element.type === "image"
        ? true
        : isVoid(element);
    },
    isInline: isInline => element => {
      return isInline(element);
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

function getAllImageNodes(editor: Editor) {
  const [...images] = findNodes(editor, n => n.type === "image");
  return images.map(([node]) => node) as ImageElement[];
}

export function ImageAddon(
  props: Addon & {
    onUploadRequest?: (files: globalThis.FileList | null) => Promise<string>;
    onRemoved?: (url: string | null) => void;
    onChange?: (images: ImageElement[]) => void;
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
      const node = getNodeFromSelection(editor, imageRef.current);
      if (node && isImageElement(node)) {
        setPreviewData(d => {
          if (typeof node.previewId === "number") {
            const _d = [...d];
            _d[node.previewId] = "";
            return _d;
          }
          return d;
        });
      }
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

  let imageUrls: ImageElement[] = [];
  if (props.onChange) {
    imageUrls = getAllImageNodes(editor)
      .map(it => it)
      .filter(isDefined)
      .filter(isFilled);
  }

  useEffect(() => {
    props.onChange && props.onChange(imageUrls);
  }, [JSON.stringify(imageUrls), props.onChange]);

  const { addon } = useCreateAddon(ImageAddonImpl, props);

  useRenderElement(
    {
      typeMatch: /image/,
      renderElement: renderElementProps => (
        <Image
          previewData={previewData}
          onOpenFileRequest={() => fileRef.current && fileRef.current.click()}
          onRemoved={props.onRemoved}
          {...renderElementProps}
        />
      )
    },
    props,
    [previewData]
  );

  return <FileUpload ref={fileRef} onChange={handleFile} multiple={false} />;
}
