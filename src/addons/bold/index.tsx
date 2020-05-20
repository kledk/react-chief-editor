import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import {
  useCreateAddon,
  useRenderLeaf,
  useOnKeyDown,
  useLabels,
  InjectedLabels
} from "../../chief/chief";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { shortcutText } from "../../shortcut";
import { Control } from "../../control";

const shortcut = "mod+b";

export const boldControl: Control = {
  category: "marks",
  render: () => {
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

export function BoldAddon(props: Addon) {
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
