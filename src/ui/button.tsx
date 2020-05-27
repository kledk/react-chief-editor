import styled from "styled-components";
import { ButtonBase } from "./button-base";

export const Button = styled(ButtonBase)`
  background-color: ${props => props.theme.colors.primary};
  :hover  {
    filter: brightness(85%);
  }
  :active  {
    filter: brightness(75%);
  }
  :disabled {
    background-color: ${props => props.theme.colors.gray[400]};
    color: ${props => props.theme.colors.gray[500]};
  }
  color: white;
  border-radius: 0;
  border: none;
  padding: 4px 8px;
`;
