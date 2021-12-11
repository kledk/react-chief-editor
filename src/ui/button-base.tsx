import styled from "styled-components";
import { OverrideTheme } from "../override-theme";
import { uiStyle } from "./ui-wrap";
export const ButtonBase = styled.button.attrs({ contentEditable: false })`
  ${uiStyle}
  line-height: 1.15;
  margin: 0;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  ${(props) => OverrideTheme("ButtonBase", props)}
`;
