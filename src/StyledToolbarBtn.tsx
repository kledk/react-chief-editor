import styled from "styled-components";
import { CleanButton } from "./clean-button";
import { OverrideTheme } from "./override-theme";

export const StyledToolbarBtn = styled(CleanButton)<{
  isActive?: boolean;
  rounded?: boolean;
}>`
  transition: all 250ms;
  background-color: white;
  font-size: 0.9em;
  &:hover {
    background-color: ${props =>
      props.disabled ? undefined : props.theme.colors.gray[200]};
  }
  &:active {
    background-color: ${props => props.theme.colors.gray[100]};
  }
  &:first-child {
    padding-left: 10px;
  }
  &:last-child {
    padding-right: 10px;
  }
  border-radius: ${props => (props.rounded ? "5px" : undefined)};
  padding: 8px;
  color: ${props => (props.isActive ? props.theme.colors.primary : undefined)};
  border: none;
  ${props => OverrideTheme("StyledToolbarBtn", props)}
`;
