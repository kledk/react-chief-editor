import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { useCreateAddon, useRenderLeaf, useOnKeyDown } from "../../chief/chief";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { toKeyName } from "is-hotkey";
import { shortcutText } from "../../shortcut";

const shortcut = "mod+b";

export const BoldImpl: Addon<{ name: string }> = {
  name: "bold",
  hoverMenu: {
    order: 1,
    category: "marks",
    renderButton: (editor, addon) => {
      return (
        <MarkBtn
          // @ts-ignore
          tooltip={{
            label: addon.labels?.name,
            shortcut: shortcutText(shortcut)
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
  useCreateAddon(BoldImpl, props);
  useRenderLeaf(
    {
      renderLeaf: props => renderLeaf(props, "bold", "strong")
    },
    props
  );
  useOnKeyDown({
    pattern: shortcut,
    handler: (event, editor) => {
      event.preventDefault();
      toggleFormat(editor, "bold");
      return true;
    }
  });
  return null;
}
