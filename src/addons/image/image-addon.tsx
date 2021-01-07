import React, { useRef, useEffect } from "react";
import { Editor, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { useSlate, ReactEditor } from "slate-react";
import { isDefined, isFilled } from "ts-is-present";
import { ImageElement, isImageElement } from ".";
import {
  AddonProps,
  useOnKeyDown,
  getNodeFromSelection,
  usePlugin,
  useRenderElement,
} from "../..";
import { iPresenter } from "../../chief";
import { registerVoidType } from "../../chief/utils/register-void";
import { FileUpload } from "../../FileUpload";
import { findNodes } from "../../utils";
import { ImageBlock } from "./image-element";

const insertImage = (editor: ReactEditor, url: string) => {
  const image = { type: "image", url, children: [{ text: "" }] };
  Transforms.insertNodes(editor, image);
};

function getAllImageNodes(editor: Editor) {
  const [...images] = findNodes(editor, (n) => n.type === "image");
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
  useOnKeyDown({
    pattern: ["delete", "backspace"],
    handler: (_e, editor) => {
      if (editor.selection) {
        const element = getNodeFromSelection(
          editor,
          editor.selection
        ) as ImageElement;

        if (Editor.isVoid(editor, element)) {
          props.onRemoved && props.onRemoved(element.url);
          Transforms.delete(editor, {
            at: ReactEditor.findPath(editor, element),
          });
        }
      }
    },
  });
  usePlugin({
    isVoid: registerVoidType("image", isImageElement),
    insertData: (insertData, editor) => (data) => {
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
  });

  const onPreview = (dataUrl: FileReader["result"]) => {
    if (typeof dataUrl === "string") {
      if (HistoryEditor.isHistoryEditor(editor)) {
        HistoryEditor.withoutSaving(editor, () => {
          Transforms.setNodes(editor, {
            url: dataUrl,
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
            url,
            align: "center",
          },
          {
            at: imageRef.current!,
          }
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
          error: "failedupload",
        },
        {
          at: imageRef.current,
        }
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
      .map((it) => it)
      .filter(isDefined)
      .filter(isFilled);
  }

  useEffect(() => {
    props.onChange && props.onChange(imageUrls);
  }, [JSON.stringify(imageUrls), props.onChange]);
  useRenderElement<ImageElement>(
    {
      typeMatch: "image",
      renderElement: (renderElementProps) => (
        <ImageBlock
          onOpenFileRequest={() => fileRef.current && fileRef.current.click()}
          onRemoved={props.onRemoved}
          {...renderElementProps}
        />
      ),
    },
    [props.onRemoved]
  );
  return (
    <FileUpload
      accept={"image/*"}
      ref={fileRef}
      onChange={handleFile}
      multiple={false}
    />
  );
}

const Presenter: iPresenter<ImageElement> = {
  element: {
    typeMatch: "image",
    renderElement: (props) => (
      <div
        style={{
          display: "flex",
          justifyContent:
            props.element.align === "center"
              ? "center"
              : props.element.align === "left"
              ? "flex-start"
              : "flex-end",
        }}
      >
        <img
          style={{
            objectFit: "fill",
            width: props.element.width,
            height: props.element.height,
            display: "block",
          }}
          alt={props.element.caption}
          src={props.element?.url ? props.element.url : ""}
        />
      </div>
    ),
  },
};

ImageAddon.Presenter = Presenter;
