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
        markType="underline"
      >
        U
      </MarkBtn>
    );
  }
};

const _renderLeaf: InjectedRenderLeaf = {
  renderLeaf: props => renderLeaf(props, "underline", "u")
};

const Presenter: iPresenter = {
  leaf: _renderLeaf
};

export function UnderlineAddon(props: AddonProps) {
  useLabels(props.labels);
  useRenderLeaf(_renderLeaf);
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

UnderlineAddon.Presenter = Presenter;
