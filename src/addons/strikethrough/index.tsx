import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { FormatBtn } from "../../aeditor";

export const StrikethroughAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "strikethrough", "s");
  },
  contextMenu: {
    order: 4,
    category: "marks",
    renderButton: () => {
      return <FormatBtn formatType="strikethrough">S</FormatBtn>;
    }
  }
};
