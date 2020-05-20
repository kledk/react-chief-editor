import React from "react";
import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import {
  useCreateAddon,
  useRenderLeaf,
  useOnKeyDown,
  useLabels
} from "../../chief/chief";
import { shortcutText } from "../../shortcut";
import { Control } from "../../control";

const shortcut = "mod+i";

export const italicControl: Control = {
  category: "marks",
  render: () => {
    return (
      <MarkBtn
        tooltip={{
          label: {
            key: "marks.italic",
            defaultLabel: "Italic"
          },
          shortcut: shortcutText(shortcut)
        }}
        formatType="italic"
      >
        I
      </MarkBtn>
    );
  }
};

export function ItalicAddon(props: Addon) {
  useLabels(props.labels);
  useRenderLeaf({
    renderLeaf: props => {
      return renderLeaf(props, "italic", "em");
    }
  });
  useOnKeyDown({
    pattern: shortcut,
    handler: (event, editor) => {
      event.preventDefault();
      toggleFormat(editor, "italic");
      return true;
    }
  });
  return null;
}
