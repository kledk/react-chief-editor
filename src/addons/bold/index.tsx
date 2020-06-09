import React from "react";
import { AddonProps } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { useRenderLeaf } from "../../chief/hooks/use-render-leaf";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { useLabels } from "../../chief/hooks/use-labels";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { shortcutText } from "../../shortcut";
import { Control } from "../../control";
import { ReactEditor } from "slate-react";
import { InjectedRenderLeaf } from "../../chief";

const shortcut = "mod+b";

const action = (editor: ReactEditor) => toggleFormat(editor, "bold");

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
        markType="bold"
      >
        B
      </MarkBtn>
    );
  }
};

const _renderLeaf: InjectedRenderLeaf = {
  renderLeaf: props => renderLeaf(props, "bold", "strong")
};

export function BoldAddon(props: AddonProps) {
  // useAddonAction("bold", action);

  // const boldToggle = useAddonAction("bold");

  useLabels(props.labels);
  useRenderLeaf(_renderLeaf);
  useOnKeyDown({
    pattern: shortcut,
    handler: (event, editor) => {
      event.preventDefault();
      action(editor);
      return true;
    }
  });
  return null;
}



BoldAddon.Control = boldControl;

export const AddonBold = {
  Addon: BoldAddon,
  Render: {
    renderLeaf: _renderLeaf
  }
};
