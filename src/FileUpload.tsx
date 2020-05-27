import React from "react";
import styled from "styled-components";

const HiddenFileInput = styled.input.attrs({
  type: "file"
})`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
`;

export const FileUpload = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "id">
>((props, ref) => <HiddenFileInput ref={ref} {...props} />);
