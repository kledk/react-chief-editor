import React from "react";
import { useSlate } from "slate-react";
import { ToolbarBtn } from "./ToolbarBtn";
import { Editor, Transforms, Text } from "slate";

export function toggleFormat(editor: Editor, format: string) {
  let isFormatted = isMark(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: !isFormatted },
    { match: n => Text.isText(n), split: true }
  );
}

const isMark = (editor: Editor, formatType: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => Boolean(n[formatType])
  });
  return Boolean(match);
};

export function MarkBtn(
  props: {
    markType: string;
  } & React.ComponentProps<typeof ToolbarBtn>
) {
  const { markType: formatType, ...otherProps } = props;
  const editor = useSlate();
  const isActive = isMark(editor, props.markType);
  return (
    <ToolbarBtn
      isActive={isActive}
      onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        toggleFormat(editor, props.markType);
      }}
      {...otherProps}
    />
  );
}
