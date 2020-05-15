import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useCreateAddon, useRenderLeaf } from "../../chief/chief";

export const ItalicAddonImpl: Addon = {
  onKeyDown: (event, editor) => {
    if (event.key === "i" && event.ctrlKey) {
      event.preventDefault();
      toggleFormat(editor, "italic");
      return true;
    }
    return false;
  },
  hoverMenu: {
    order: 2,
    category: "marks",
    renderButton: () => {
      return (
        <MarkBtn
          tooltip={{ label: "Italic", shortcut: "⌘+I" }}
          formatType="italic"
        >
          I
        </MarkBtn>
      );
    }
  }
};

export function ItalicAddon(props: Addon) {
  useCreateAddon(ItalicAddonImpl, props);
  useRenderLeaf(
    {
      renderLeaf: props => {
        return renderLeaf(props, "italic", "em");
      }
    },
    props
  );
  return null;
}
