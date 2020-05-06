import styled from "styled-components";
import { Button } from "./Button";
export const StyledToolbarBtn = styled(Button) <{
    isActive?: boolean;
}> `
  background-color: white;
  &:hover {
    background-color: #ddd;
  }
  &:active {
    background-color: #eee;
  }
  &:first-child {
    padding-left: 10px;
  }
  &:last-child {
    padding-right: 10px;
  }
  padding: 8px;
  color: ${props => (props.isActive ? "rgb(46, 170, 220)" : undefined)};
  border: none;
  ${props => props.theme.preferDarkOption &&
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
`;
