import React from "react";
import { AddonProps } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { useRenderLeaf } from "../../chief/hooks/use-render-leaf";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { useLabels } from "../../chief/hooks/use-labels";
import { shortcutText } from "../../shortcut";
import { InjectedRenderLeaf } from "../../chief";
import { iPresenter } from "../../chief/chief-presentation";

const shortcut = "mod+i";

export function ItalicControl(props: { children: React.ReactNode }) {
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
      {props.children}
    </MarkBtn>
  );
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
