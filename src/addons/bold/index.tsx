import React from "react";
import { AddonProps } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { useRenderLeaf } from "../../chief/hooks/use-render-leaf";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { useLabels } from "../../chief/hooks/use-labels";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { shortcutText } from "../../shortcut";
import { Control } from "../../control";

const shortcut = "mod+b";

export const boldControl: Control = {
  category: "marks",
  Component: () => {
    return (
      <MarkBtn
        tooltip={{
          label: {
            key: "marks.bold",
            defaultLabel: "Bold"
          },
          shortcut: shortcutText(shortcut)
        }}
        formatType="bold"
      >
        B
      </MarkBtn>
    );
  }
};

export function BoldAddon(props: AddonProps) {
  useLabels(props.labels);
  useRenderLeaf({
    renderLeaf: props => renderLeaf(props, "bold", "strong")
  });
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

BoldAddon.Control = boldControl;
