import React from "react";
import { AddonProps } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useRenderLeaf } from "../../chief/hooks/use-render-leaf";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { useLabels } from "../../chief/hooks/use-labels";
import { shortcutText } from "../../shortcut";
import { Control } from "../../control";
import { InjectedRenderLeaf } from "../../chief";
import { iPresenter } from "../../chief/chief-presentation";

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
        markType="strikethrough"
      >
        S
      </MarkBtn>
    );
  }
};

const _renderLeaf: InjectedRenderLeaf = {
  renderLeaf: props => renderLeaf(props, "strikethrough", "s")
};

const Presenter: iPresenter = {
  leaf: _renderLeaf
};

export function StrikethroughAddon(props: AddonProps) {
  useLabels(props.labels);
  useRenderLeaf(_renderLeaf);
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

StrikethroughAddon.Presenter = Presenter;
