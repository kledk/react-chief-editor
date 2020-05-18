import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useCreateAddon, useRenderLeaf, useOnKeyDown } from "../../chief/chief";
import { shortcutText } from "../../shortcut";

const shortcut = "mod+s";

export const StrikethroughAddonImpl: Addon = {
  hoverMenu: {
    order: 4,
    category: "marks",
    renderButton: () => {
      return (
        <MarkBtn
          tooltip={{
            label: "Strike-through",
            shortcut: shortcutText(shortcut)
          }}
          formatType="strikethrough"
        >
          S
        </MarkBtn>
      );
    }
  }
};

export function StrikethroughAddon(props: Addon) {
  useCreateAddon(StrikethroughAddonImpl, props);
  useRenderLeaf(
    {
      renderLeaf: props => {
        return renderLeaf(props, "strikethrough", "s");
      }
    },
    props
  );
  useOnKeyDown(
    {
      pattern: shortcut,
      handler: (event, editor) => {
        event.preventDefault();
        toggleFormat(editor, "strikethrough");
        return true;
      }
    },
    props
  );
  return null;
}
