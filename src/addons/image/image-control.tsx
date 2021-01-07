import React from "react";
import { ReactEditor, useSlate } from "slate-react";
import { isNodeActive } from "../../utils";
import { RichEditor } from "../../chief/editor";
import { ToolbarBtn } from "../../ToolbarBtn";
import { ControlProps, useIsControlEligable } from "../../chief/controls";

export function ImageControl(props: ControlProps) {
  const editor = useSlate();
  if (
    !useIsControlEligable({
      isText: true,
      isEmpty: true,
    })
  ) {
    return null;
  }
  return (
    <ToolbarBtn
      tooltip={{
        label: {
          key: `elements.image`,
          defaultLabel: "Image",
        },
      }}
      isActive={isNodeActive(editor, "image")}
      onClick={() => {
        RichEditor.insertBlock(editor, "image");
        ReactEditor.focus(editor);
      }}
    >
      {props.children}
    </ToolbarBtn>
  );
}
