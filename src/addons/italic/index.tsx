import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { RichEditor } from "../../aeditor";
import { MarkBtn } from "../../mark-button";

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
  hoverMenu: {
    order: 2,
    category: "marks",
    renderButton: () => {
      return <MarkBtn tooltip={{ label: "Italic", shortcut: "⌘+I" }} formatType="italic">I</MarkBtn>;
    }
  }
};
