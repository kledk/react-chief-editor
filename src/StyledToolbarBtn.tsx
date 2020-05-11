import styled from "styled-components";
import { Button } from "./Button";
import { OverrideTheme } from "./override-theme";

export const StyledToolbarBtn = styled(Button)<{
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
  ${props =>
    props.theme.preferDarkOption &&
    `
@media (prefers-color-scheme: dark) {
  background-color: grey;
  color: ${props.isActive ? "white" : undefined};
  &:hover {
    background-color: dimgrey;
  }
  &:active {
    background-color: darkgrey;
  }
  }`}
  ${props => OverrideTheme("StyledToolbarBtn", props)}
`;
