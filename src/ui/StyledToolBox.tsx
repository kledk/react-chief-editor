import styled from "styled-components";
import { OverrideTheme } from "../override-theme";
import { UiWrap } from "./ui-wrap";

export const StyledToolBase = styled(UiWrap)`
  overflow: hidden;
  border-radius: 6px;
  box-shadow: rgba(15, 15, 15, 0.06) 0px 1px 15px 8px,
    rgba(15, 15, 15, 0.05) 0px 3px 6px, rgba(15, 15, 15, 0.09) 0px 5px 25px;
`;

export const StyledToolBox = styled(StyledToolBase)`
  background-color: white;
  ${(props) => OverrideTheme("StyledToolBox", props)}
`;
