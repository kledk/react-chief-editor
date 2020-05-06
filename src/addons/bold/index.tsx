import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { RichEditor, FormatBtn } from "../../aeditor";

export const BoldAddon: Addon = {
  name: "bold",
  renderLeaf(props) {
    return renderLeaf(props, "bold", "strong");
  },
  onKeyDown: (event, editor) => {
    if (event.key === "b" && event.ctrlKey) {
      event.preventDefault();
      RichEditor.toggleFormat(editor, "bold");
      return true;
    }
    return false;
  },
  hoverMenu: {
    order: 1,
    category: "marks",
    renderButton: () => {
      return <FormatBtn formatType="bold">B</FormatBtn>;
    }
  }
};
