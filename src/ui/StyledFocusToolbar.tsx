import styled from "styled-components";
import { StyledToolBase } from "../StyledToolBox";
import { ButtonBase } from "./button-base";

export const StyledFocusToolBtn = styled(ButtonBase)`
  background-color: rgba(47, 47, 47, 0.67);
  &:hover {
    background-color: rgba(67, 67, 67, 0.67);
  }
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
`;

export const StyledFocusToolbar = styled(StyledToolBase)`
  background-color: transparent;
`;
