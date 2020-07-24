import styled, { css } from "styled-components";
import { OverrideTheme } from "../override-theme";

export const uiStyle = css`
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  ${props => OverrideTheme("ui", props)}
`;

export const UiWrap = styled.div`
  ${uiStyle}
`;
