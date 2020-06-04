import React from "react";
import groupBy from "lodash/groupBy";
import { ReactEditor, useSlate } from "slate-react";
import { StyledToolbarBtn } from "../../ui/styled-toolbar-btn";
import { StyledToolBox } from "../../StyledToolBox";
import { ToolDivider } from "../../ToolDivider";
import { ToolsWrapper } from "../../ToolsWrapper";
import { isNodeActive } from "../../utils";
import { Control } from "../../control";
import { RichEditor } from "../../chief/editor";
import { ToolbarBtn } from "../../ToolbarBtn";

export function BlockInsertControls(props: { controls: Control[] }) {
  const editor = useSlate();
  const controls = props.controls;
  if (controls.length > 0) {
    const grouped = groupBy(controls, "category");
    return (
      <StyledToolBox>
        <ToolsWrapper>
          {Object.entries(grouped).map(([k, groupedControls]) => (
            <React.Fragment>
              {groupedControls.map((control, i) => {
                if (control.Component) {
                  return <control.Component key={i} />;
                }
                const renderButton = control.render;
                return typeof renderButton === "function"
                  ? renderButton(editor)
                  : renderButton;
              })}
              <ToolDivider />
            </React.Fragment>
          ))}
          <ToolDivider />
          <ToolbarBtn
            isActive={isNodeActive(editor, "paragraph")}
            onMouseDown={() => {
              RichEditor.insertBlock(editor, "paragraph");
              ReactEditor.focus(editor);
            }}
          >
            Text
          </ToolbarBtn>
        </ToolsWrapper>
      </StyledToolBox>
    );
  }
  return null;
}
