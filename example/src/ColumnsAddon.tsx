// @ts-nocheck
import React from "react";
import { Editor as SlateEditor } from "slate";
import {
  AddonProps,
  useRenderElement,
  usePlugin,
  useOnKeyDown
} from "../../src/index";

// Custom addon creation

export function ColumnsAddon(props: AddonProps) {
  usePlugin({});

  useOnKeyDown({
    pattern: "enter",
    handler: (e, editor) => {
      const { selection } = editor;
      if (selection) {
        const [node] = SlateEditor.nodes(editor, {
          at: selection,
          match: n => n.type === "columns"
        });
        if (node) {
          e.preventDefault();
          editor.insertText("\n");
        }
      }
    }
  });

  useRenderElement({
    typeMatch: "columns",
    renderElement: (props, editor) => {
      return (
        <div
          {...props.attributes}
          style={{ display: "flex", flexDirection: "row" }}
        >
          {props.children}
        </div>
      );
    }
  });

  useRenderElement({
    typeMatch: "column",
    renderElement: (props, editor) => {
      return (
        <div
          style={{ flex: 1, border: "1px dashed #ccc" }}
          {...props.attributes}
        >
          {React.Children.map(props.children, it => it)}
        </div>
      );
    }
  });

  return null;
}
