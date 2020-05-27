import React from "react";
import { AddonProps } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useRenderLeaf } from "../../chief/hooks/use-render-leaf";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { useLabels } from "../../chief/hooks/use-labels";
import { shortcutText } from "../../shortcut";
import { Control } from "../../control";

const shortcut = "mod+u";

export const underlineControl: Control = {
  category: "marks",
  render: () => {
    return (
      <MarkBtn
        tooltip={{
          label: {
            key: "marks.underline",
            defaultLabel: "Underline"
          },
          shortcut: shortcutText(shortcut)
        }}
        formatType="underline"
      >
        U
      </MarkBtn>
    );
  }
};

export function UnderlineAddon(props: AddonProps) {
  useLabels(props.labels);
  useRenderLeaf({
    renderLeaf: props => {
      return renderLeaf(props, "underline", "u");
    }
  });
  useOnKeyDown({
    pattern: shortcut,
    handler: (event, editor) => {
      event.preventDefault();
      toggleFormat(editor, "underline");
      return true;
    }
  });
  return null;
}
