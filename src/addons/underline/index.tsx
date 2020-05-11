import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn } from "../../mark-button";

export const UnderlineAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "underline", "u");
  },
  hoverMenu: {
    order: 3,
    category: "marks",
    renderButton: () => {
      return <MarkBtn tooltip={{ label: "Underline", shortcut: "⌘+U" }} formatType="underline">U</MarkBtn>;
    }
  }
};
