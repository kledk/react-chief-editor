import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { FormatBtn } from "../../aeditor";

export const UnderlineAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "underline", "u");
  },
  hoverMenu: {
    order: 3,
    category: "marks",
    renderButton: () => {
      return <FormatBtn formatType="underline">U</FormatBtn>;
    }
  }
};
