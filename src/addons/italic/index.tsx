import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useCreateAddon, useRenderLeaf, useOnKeyDown } from "../../chief/chief";
import { shortcutText } from "../../shortcut";

const shortcut = "mod+i";

export const ItalicAddonImpl: Addon = {
  hoverMenu: {
    order: 2,
    category: "marks",
    renderButton: () => {
      return (
        <MarkBtn
          tooltip={{ label: "Italic", shortcut: shortcutText(shortcut) }}
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
  useOnKeyDown(
    {
      pattern: shortcut,
      handler: (event, editor) => {
        event.preventDefault();
        toggleFormat(editor, "italic");
        return true;
      }
    },
    props
  );
  return null;
}
