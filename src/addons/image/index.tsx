import {} from "./image-element";
import React, { useRef, useEffect } from "react";
import { AddonProps } from "../../addon";
import { Element, Editor, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { isNodeActive, getNodeFromSelection, findNodes } from "../../utils";
import { RichEditor } from "../../chief/editor";
import { FileUpload } from "../../FileUpload";
import { ToolbarBtn } from "../../ToolbarBtn";
import {
  ChiefElement,
  isChiefElement
} from "../../chief/chief";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { usePlugin } from "../../chief/hooks/use-plugin";
import { isDefined, isFilled } from "ts-is-present";
import { HistoryEditor } from "slate-history";
import isUrl from "is-url";
import { ImageExtensions } from "./ImageExtensions";
import { ImageBlock } from "./image-element";
import { Control } from "../../control";

export interface ImageElement extends ChiefElement {
  type: "image";
  url: string | null;
  caption?: string;
  previewId?: number;
}

export function isImageElement(element: unknown): element is ImageElement {
  return isChiefElement(element) && element.type === "image";
}

export const imageBlockControls: Control[] = [
  {
    category: "headings",
    render: editor => (
      <ToolbarBtn
        isActive={isNodeActive(editor, "image")}
        onClick={() => {
          RichEditor.insertBlock(editor, "image");
          ReactEditor.focus(editor);
        }}
      >
        Image
      </ToolbarBtn>
    )
  }
];

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
  props: AddonProps & {
    onUploadRequest?: (files: globalThis.FileList | null) => Promise<string>;
    onRemoved?: (url: string | null) => void;
    onChange?: (images: ImageElement[]) => void;
  }
) {
  const editor = useSlate();
  const fileRef = useRef<HTMLInputElement>(null);

  usePlugin({
    isVoid: isVoid => element =>
      isImageElement(element) && element.type === "image"
        ? true
        : isVoid(element),
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

  useRenderElement<ImageElement>({
    typeMatch: "image",
    renderElement: renderElementProps => (
      <ImageBlock
        onOpenFileRequest={() => fileRef.current && fileRef.current.click()}
        onRemoved={props.onRemoved}
        {...renderElementProps}
      />
    )
  });

  return <FileUpload accept={"image/*"} ref={fileRef} onChange={handleFile} multiple={false} />;
}
