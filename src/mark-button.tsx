import React from "react";
import { useSlate } from "slate-react";
import { StyledToolbarBtn } from "./StyledToolbarBtn";
import { isTextFormat, RichEditor } from "./aeditor";
import { ToolbarBtn } from "./ToolbarBtn";

export function MarkBtn(
  props: {
    formatType: string;
  } & React.ComponentProps<typeof ToolbarBtn>
) {
  const { formatType, ...otherProps } = props;
  const editor = useSlate();
  const isActive = isTextFormat(editor, props.formatType);
  return (
    <ToolbarBtn
      isActive={isActive}
      onClick={() => RichEditor.toggleFormat(editor, props.formatType)}
      {...otherProps}
    />
  );
}
