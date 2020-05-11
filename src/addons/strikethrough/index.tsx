import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn } from "../../mark-button";

export const StrikethroughAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "strikethrough", "s");
  },
  hoverMenu: {
    order: 4,
    category: "marks",
    renderButton: () => {
      return <MarkBtn tooltip={{ label: "Strike-through", shortcut: "⌘+S" }} formatType="strikethrough">S</MarkBtn>;
    }
  }
};
