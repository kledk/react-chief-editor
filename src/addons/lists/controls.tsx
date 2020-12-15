import React from "react";
import { toggleList } from "./transforms";
import { ReactEditor, useSlate } from "slate-react";
import { isNodeActive } from "../../utils";
import { ToolbarBtn } from "../../ToolbarBtn";
import { TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST } from "./index";
import { ControlProps, useIsControlEligable } from "../../chief/controls";

export function ListControl(
  props: {
    type: typeof TYPE_ORDERED_LIST | typeof TYPE_UNORDERED_LIST;
  } & ControlProps
) {
  const editor = useSlate();
  const { type, children } = props;
  if (
    !useIsControlEligable({
      isText: true,
      isEmpty: true
    })
  ) {
    return null;
  }
  return (
    <ToolbarBtn
      tooltip={{
        label: {
          key: `elements.${type}`,
          defaultLabel: type
        }
      }}
      isActive={isNodeActive(editor, type)}
      onClick={() => {
        toggleList(editor, type);
        ReactEditor.focus(editor);
      }}
    >
      {children || type}
    </ToolbarBtn>
  );
}
