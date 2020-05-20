import React from "react";
import { RenderElementProps } from "slate-react";
import styled from "styled-components";
import { ElementWrapper } from "../../element-wrapper";
import { StyledToolBase } from "../../StyledToolBox";
import { ToolsWrapper } from "../../ToolsWrapper";
import { CleanButton } from "../../ui/clean-button";

const StyledFocusToolbar = styled(StyledToolBase)`
  background-color: transparent;
  ${CleanButton} {
    background-color: rgba(47, 47, 47, 0.67);
    &:hover {
      background-color: rgba(67, 67, 67, 0.67);
    }
    font-size: 0.8em;
    color: white;
    border: none;
    &:first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    &:last-child {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
    padding: 4px 8px;
    margin: 0 1px;
  }
`;

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
      attentionChildren={
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
