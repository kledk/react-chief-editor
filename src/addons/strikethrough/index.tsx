import React from "react";
import { AddonProps } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useRenderLeaf } from "../../chief/hooks/use-render-leaf";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { useLabels } from "../../chief/hooks/use-labels";
import { shortcutText } from "../../shortcut";
import { Control } from "../../control";

const shortcut = "mod+s";

export const strikethroughControl: Control = {
  category: "marks",
  render: () => {
    return (
      <MarkBtn
        tooltip={{
          label: {
            key: "marks.strikethrough",
            defaultLabel: "Strike-through"
          },
          shortcut: shortcutText(shortcut)
        }}
        formatType="strikethrough"
      >
        S
      </MarkBtn>
    );
  }
};

export function StrikethroughAddon(props: AddonProps) {
  useLabels(props.labels);
  useRenderLeaf({
    renderLeaf: props => {
      return renderLeaf(props, "strikethrough", "s");
    }
  });
  useOnKeyDown({
    pattern: shortcut,
    handler: (event, editor) => {
      event.preventDefault();
      toggleFormat(editor, "strikethrough");
      return true;
    }
  });
  return null;
}
