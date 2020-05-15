import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn } from "../../mark-button";
import { useCreateAddon, useRenderLeaf } from "../../chief/chief";

export const UnderlineAddonImpl: Addon = {
  hoverMenu: {
    order: 3,
    category: "marks",
    renderButton: () => {
      return (
        <MarkBtn
          tooltip={{ label: "Underline", shortcut: "⌘+U" }}
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
  return null;
}
