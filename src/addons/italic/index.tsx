import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { RichEditor, FormatBtn } from "../../aeditor";

export const ItalicAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "italic", "em");
  },
  onKeyDown: (event, editor) => {
    if (event.key === "i" && event.ctrlKey) {
      event.preventDefault();
      RichEditor.toggleFormat(editor, "italic");
      return true;
    }
    return false;
  },
  contextMenu: {
    order: 2,
    category: "marks",
    renderButton: () => {
      return <FormatBtn formatType="italic">I</FormatBtn>;
    }
  }
};
