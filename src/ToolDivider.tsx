import styled from "styled-components";
export const ToolDivider = styled.div`
  width: 1px;
  background-color: #f5f5f5;
  ${props => props.theme.preferDarkOption &&
        `
@media (prefers-color-scheme: dark) {
  background-color: #737373;
  }`}
`;
