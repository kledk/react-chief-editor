import React from "react";
import { toggleList } from "./transforms";
import { ReactEditor, useSlate } from "slate-react";
import { isNodeActive } from "../../utils";
import { ToolbarBtn } from "../../ToolbarBtn";
import { TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST } from "./index";
import { useControl } from "../hovering-tool";
import { Control } from "../../control";

export const createListControl = (
  type: typeof TYPE_ORDERED_LIST | typeof TYPE_UNORDERED_LIST,
  children?: React.ReactNode
): Control => ({
  category: "lists",
  Component: () => {
    const editor = useSlate();
    return (
      <ToolbarBtn
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
});

export function ListControl(props: {
  type: Parameters<typeof createListControl>["0"];
  children?: React.ReactNode;
}) {
  return useControl(createListControl(props.type, props.children));
}
