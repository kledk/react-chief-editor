import React, { useRef, useState, useCallback, useEffect } from "react";
import { Addon } from "../../addon";
import { Element, Editor, Transforms } from "slate";
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
import { useRenderElement, usePlugin, useCreateAddon } from "../../chief/chief";
import { CleanButton } from "../../clean-button";
import { isDefined, isFilled } from "ts-is-present";
import { WithAttentionToolbar } from "./StyledFocusToolbar";
import { HistoryEditor } from "slate-history";
import { Input, InputWrapper } from "../../InputWrapper";
import isUrl from "is-url";
import { ImageExtensions } from "./ImageExtensions";

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
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  form {
    width: 70%;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
  h2,
  p {
    color: ${props => props.theme.colors.gray[600]};
    user-select: none;
  }
`;

const Button = styled(CleanButton)`
  background-color: ${props => props.theme.colors.primary};
  :hover  {
    filter: brightness(85%);
  }
  :active  {
    filter: brightness(75%);
  }
  :disabled {
    background-color: ${props => props.theme.colors.gray[400]};
    color: ${props => props.theme.colors.gray[500]};
  }
  color: white;
  border-radius: 0;
  border: none;
  padding: 4px 8px;
`;

export const Image = (
  props: RenderElementProps & {
    onOpenFileRequest?: () => void;
    onRemoved?: (url: string | null) => void;
  }
) => {
  const focused = useFocused();
  const selected = useSelected();
  const editor = useSlate();
  const { onOpenFileRequest, onRemoved, ...renderElementProps } = props;
  const { element, children, attributes } = renderElementProps;
  if (!isImageElement(element)) {
    return null;
  }

  const [embedUrl, setEmbedUrl] = useState(element.url || "");
  const [isReplacing, setIsReplacing] = useState(false);

  const handleSubmitEmbed = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (embedUrl.length > 0) {
        Transforms.setNodes(
          editor,
          {
            url: embedUrl
          },
          {
            at: ReactEditor.findPath(editor, element)
          }
        );
        if (isReplacing) {
          setIsReplacing(false);
        }
      }
    },
    [embedUrl, isReplacing]
  );

  useEffect(() => {
    if (element.url && isReplacing) {
      setIsReplacing(false);
    }
  }, [element.url]);

  const handleDelete = useCallback(() => {
    onRemoved && onRemoved(element.url);
    Transforms.delete(editor, { at: ReactEditor.findPath(editor, element) });
  }, [element]);

  const handleUpload = useCallback(() => {
    onOpenFileRequest && onOpenFileRequest();
  }, [onOpenFileRequest]);

  const toggleReplace = useCallback(() => {
    setIsReplacing(!isReplacing);
  }, [isReplacing]);

  const handleClick = () => {
    Transforms.select(editor, ReactEditor.findPath(editor, element));
  };

  let imageHandler = null;

  if (!isReplacing && element.url) {
    const src = element.url || "";
    imageHandler = (
      <WithAttentionToolbar
        {...renderElementProps}
        btns={
          <React.Fragment>
            <CleanButton onMouseDown={handleDelete}>Delete</CleanButton>
            <CleanButton onMouseDown={toggleReplace}>Replace</CleanButton>
          </React.Fragment>
        }
      >
        <div>
          <div contentEditable={false} onClick={handleClick}>
            <img
              style={{
                objectFit: "cover",
                width: "100%",
                display: "block",
                height: 400
              }}
              alt={element.caption}
              src={src}
            />
          </div>
        </div>
        {children}
      </WithAttentionToolbar>
    );
  } else {
    imageHandler = (
      <WithAttentionToolbar
        {...renderElementProps}
        btns={
          <React.Fragment>
            <CleanButton onMouseDown={handleDelete}>Delete</CleanButton>
            {isReplacing && (
              <CleanButton onMouseDown={toggleReplace}>Cancel</CleanButton>
            )}
          </React.Fragment>
        }
      >
        <div contentEditable={false}>
          <StyledImageEmptyContainer>
            <h2>Insert image</h2>
            <Button onMouseDown={handleUpload}>Upload</Button>
            <p>Or paste a link</p>
            <form onSubmit={handleSubmitEmbed} data-slate-editor>
              <InputWrapper style={{ width: "50%" }}>
                <Input
                  value={embedUrl}
                  onChange={e => setEmbedUrl(e.target.value)}
                  placeholder="Paste link"
                ></Input>
              </InputWrapper>
              <br />
              <Button disabled={embedUrl.length === 0 || !isUrl(embedUrl)}>
                Embed
              </Button>
            </form>
            {children}
          </StyledImageEmptyContainer>
        </div>
      </WithAttentionToolbar>
    );
  }

  return (
    <div
      style={{
        outline: focused && selected ? "1px solid rgb(46, 170, 220)" : "none"
      }}
      {...attributes}
      contentEditable={false}
    >
      {imageHandler}
    </div>
  );
};

export const ImageAddonImpl: Addon<{ name: string }, {}> = {
  name: "image",
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

export const isImageUrl = (url: string, extensions = ImageExtensions) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop() as string;
  return extensions.includes(ext);
};

const insertImage = (editor: ReactEditor, url: string) => {
  const image = { type: "image", url, children: [{ text: "" }] };
  Transforms.insertNodes(editor, image);
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
  const fileRef = useRef<HTMLInputElement>(null);
  useCreateAddon(ImageAddonImpl, props);

  usePlugin({
    isVoid: isVoid => element =>
      isAElement(element) && element.type === "image" ? true : isVoid(element),
    insertData: (insertData, editor) => data => {
      const { files } = data;
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          const reader = new FileReader();
          const [mime] = file.type.split("/");
          if (mime === "image") {
            reader.addEventListener("load", () => {
              const url = reader.result as string;
              insertImage(editor, url);
            });
            reader.readAsDataURL(file);
          }
        }
      } else {
        insertData(data);
      }
    },
    deleteBackward: (deleteBackward, editor) => (...args) => {
      console.log("deleteBackward", args);
      deleteBackward(...args);
    },
    deleteFragment: (deleteFragment, editor) => (...args) => {
      console.log("deleteFragment", args);
      deleteFragment(...args);
    }
  });

  const onPreview = (dataUrl: FileReader["result"]) => {
    if (typeof dataUrl === "string") {
      if (HistoryEditor.isHistoryEditor(editor)) {
        HistoryEditor.withoutSaving(editor, () => {
          Transforms.setNodes(editor, {
            url: dataUrl
          });
        });
      }
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
        Transforms.setNodes(
          editor,
          {
            url
          },
          { at: imageRef.current! }
        );
        imageRef.unref();
      }
    };
    const onUploadedFailed = () => {
      if (!imageRef.current) return;
      Transforms.setNodes(
        editor,
        {
          // url: null,
          error: "failedupload"
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

  useRenderElement({
    typeMatch: /image/,
    renderElement: renderElementProps => (
      <Image
        onOpenFileRequest={() => fileRef.current && fileRef.current.click()}
        onRemoved={props.onRemoved}
        {...renderElementProps}
      />
    )
  });

  return <FileUpload ref={fileRef} onChange={handleFile} multiple={false} />;
}
