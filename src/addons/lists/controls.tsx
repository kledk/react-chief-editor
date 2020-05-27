import React from "react";
import { toggleList } from "./transforms";
import { ReactEditor, useSlate } from "slate-react";
import { isNodeActive } from "../../utils";
import { Control } from "../../control";
import { ToolbarBtn } from "../../ToolbarBtn";
import { TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST } from "./index";

export const listControl: Control = {
  category: "lists",
  Component: () => {
    const editor = useSlate();
    return (
      <React.Fragment>
        <ToolbarBtn
          isActive={isNodeActive(editor, TYPE_ORDERED_LIST)}
          onClick={() => {
            toggleList(editor, TYPE_ORDERED_LIST);
            ReactEditor.focus(editor);
          }}
        >
          OL
        </ToolbarBtn>
        <ToolbarBtn
          isActive={isNodeActive(editor, TYPE_UNORDERED_LIST)}
          onClick={() => {
            toggleList(editor, TYPE_UNORDERED_LIST);
            ReactEditor.focus(editor);
          }}
        >
          UL
        </ToolbarBtn>
      </React.Fragment>
    );
  }
};
