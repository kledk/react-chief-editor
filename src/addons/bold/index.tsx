import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { RichEditor, useCreateAddon } from "../../editor";
import { MarkBtn, toggleFormat } from "../../mark-button";

export const BoldImpl: Addon<{ name: string }> = {
  name: "bold",
  renderLeaf(props) {
    return renderLeaf(props, "bold", "strong");
  },
  onKeyDown: (event, editor) => {
    if (event.key === "b" && event.ctrlKey) {
      event.preventDefault();
      toggleFormat(editor, "bold");
      return true;
    }
    return false;
  },
  hoverMenu: {
    order: 1,
    category: "marks",
    renderButton: (editor, addon) => {
      return (
        <MarkBtn
          // @ts-ignore
          tooltip={{
            label: addon.labels?.name,
            shortcut: "⌘+B"
          }}
          formatType="bold"
        >
          B
        </MarkBtn>
      );
    }
  },
  labels: {
    name: "Bold"
  }
};

export function BoldAddon(props: Addon<{ name: string }>) {
  const Bold = useCreateAddon(BoldImpl, props);
  return <Bold />;
}
