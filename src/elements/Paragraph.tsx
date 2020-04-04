import React from "react";
import { RenderElementProps } from "slate-react";
export const Paragraph = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};
