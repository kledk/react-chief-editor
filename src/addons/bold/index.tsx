import React from "react";
import { AddonProps } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";
import { useRenderLeaf } from "../../chief/hooks/use-render-leaf";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { useLabels } from "../../chief/hooks/use-labels";
import { MarkBtn, toggleFormat } from "../../mark-button";
import { shortcutText } from "../../shortcut";
import { ReactEditor } from "slate-react";
import { InjectedRenderLeaf } from "../../chief";
import { iPresenter } from "../../chief/chief-presentation";
import { ControlProps, useIsControlEligable } from "../../chief/controls";

const shortcut = "mod+b";

const action = (editor: ReactEditor) => toggleFormat(editor, "bold");

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

const Presenter: iPresenter = {
  leaf: _renderLeaf
};

export function BoldControl(props: ControlProps) {
  if (
    !useIsControlEligable({
      isText: true
    })
  ) {
    return null;
  }
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
      {props.children}
    </MarkBtn>
  );
}

BoldAddon.Presenter = Presenter;
