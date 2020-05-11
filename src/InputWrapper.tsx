import styled from "styled-components";

export const Input = styled.input.attrs(props => ({}))`
  &:focus {
    outline: 0;
  }
  font-size: inherit;
  line-height: inherit;
  border: none;
  background: none;
  width: 100%;
  display: block;
  resize: none;
  padding: 0px;
`;

export const InputWrapper = styled.div.attrs(props => ({
  "data-slate-editor": true
}))`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 10px;
  position: relative;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset,
    rgba(15, 15, 15, 0.1) 0px 1px 1px inset;
  background: rgba(242, 241, 238, 0.6);
  cursor: text;
  flex-grow: 1;
  flex-shrink: 1;
  margin-right: 8px;
  ${Input} {
  }
`;
