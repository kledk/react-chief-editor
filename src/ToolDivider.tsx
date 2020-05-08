import styled from "styled-components";
export const ToolDivider = styled.div`
  width: 1px;
  background-color: #eaeaea;
  ${props =>
    props.theme.preferDarkOption &&
    `
@media (prefers-color-scheme: dark) {
  background-color: #737373;
  }`}
`;
