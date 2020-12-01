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
import { useControl } from "../hovering-tool";

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
        markType="italic"
      >
        I
      </MarkBtn>
    );
  }
};

export function ItalicControl() {
  useControl(italicControl);
  return null;
}

const _renderLeaf: InjectedRenderLeaf = {
  renderLeaf: props => renderLeaf(props, "italic", "em")
};

const Presenter: iPresenter = {
  leaf: _renderLeaf
};

export function ItalicAddon(props: AddonProps) {
  useLabels(props.labels);
  useRenderLeaf(_renderLeaf);
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

ItalicAddon.Presenter = Presenter;
