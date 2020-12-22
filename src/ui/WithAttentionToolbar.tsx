import React from "react";
import { RenderElementProps } from "slate-react";
import { ElementWrapper } from "../element-wrapper";
import { ToolsWrapper } from "../ToolsWrapper";
import { StyledFocusToolbar } from "./StyledFocusToolbar";

export function WithAttentionToolbar(
  props: RenderElementProps & {
    children: React.ReactNode;
    btns: React.ReactNode;
  }
) {
  const { btns, children, ...renderElementProps } = props;
  return (
    <ElementWrapper
      {...renderElementProps}
      renderOnFocus={
        <StyledFocusToolbar>
          <ToolsWrapper>{btns}</ToolsWrapper>
        </StyledFocusToolbar>
      }
      style={{ right: 0, marginTop: 5, marginRight: 5 }}
    >
      {children}
    </ElementWrapper>
  );
}
