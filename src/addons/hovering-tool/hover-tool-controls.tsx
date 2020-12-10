import React, { ReactNode } from "react";
import groupBy from "lodash/groupBy";
import { Editor as SlateEditor } from "slate";
import { useSlate } from "slate-react";
import { StyledToolBox } from "../../StyledToolBox";
import { ToolDivider } from "../../ToolDivider";
import { ToolsWrapper } from "../../ToolsWrapper";
import { ChiefElement } from "../../chief/chief";
import { matchesType } from "../../chief/utils/matches-type";
import { useProvidedControls } from "../../chief/controls";

export function HoverToolControls() {
  const { controls } = useProvidedControls();
  const editor = useSlate();
  const { selection } = editor;
  if (selection) {
    const eligableControls = controls.filter(control => {
      const [match] = SlateEditor.nodes(editor, {
        match: n => {
          if (control.typeMatch && typeof n.type === "string") {
            if (matchesType(n as ChiefElement, control.typeMatch)) {
              return true;
            }
          } else if (
            !control.typeMatch &&
            !SlateEditor.isVoid(editor, n) &&
            typeof n.type === "string"
          ) {
            return true;
          }
          return false;
        }
      });
      return Boolean(match);
    });
    if (eligableControls.length > 0) {
      const groupedControls = groupBy(eligableControls, "category");
      return (
        <StyledToolBox>
          <ToolsWrapper>
            {Object.entries(groupedControls).map(
              ([type, groupedControls], i) => (
                <React.Fragment key={`${type}${i}`}>
                  {groupedControls.map((control, ii) => {
                    if (control.Component) {
                      return <control.Component key={`${type}${i}${ii}`} />;
                    }
                    const renderControl = control.render;
                    return (
                      <React.Fragment key={`${type}${i}${ii}`}>
                        {typeof renderControl === "function"
                          ? renderControl(editor)
                          : renderControl}
                      </React.Fragment>
                    );
                  })}
                  <ToolDivider />
                </React.Fragment>
              )
            )}
          </ToolsWrapper>
        </StyledToolBox>
      );
    }
  }
  return null;
}
