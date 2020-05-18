import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useCreateAddon, useRenderLeaf, useOnKeyDown } from "../../chief/chief";
import { shortcutText } from "../../shortcut";

const shortcut = "mod+u";

export const UnderlineAddonImpl: Addon = {
  hoverMenu: {
    order: 3,
    category: "marks",
    renderButton: () => {
      return (
        <MarkBtn
          tooltip={{ label: "Underline", shortcut: shortcutText(shortcut) }}
          formatType="underline"
        >
          U
        </MarkBtn>
      );
    }
  }
};

export function UnderlineAddon(props: Addon) {
  useCreateAddon(UnderlineAddonImpl, props);
  useRenderLeaf(
    {
      renderLeaf: props => {
        return renderLeaf(props, "underline", "u");
      }
    },
    props
  );
  useOnKeyDown(
    {
      pattern: shortcut,
      handler: (event, editor) => {
        event.preventDefault();
        toggleFormat(editor, "underline");
        return true;
      }
    },
    props
  );
  return null;
}
