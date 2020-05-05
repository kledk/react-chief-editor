import React from "react";
import { RenderLeafProps } from "slate-react";

export function renderLeaf(
  props: RenderLeafProps,
  leafType: string,
  rectType: string
) {
  const { attributes, children, leaf } = props;
  if (leaf[leafType]) {
    return (
      <span {...attributes}>
        {React.createElement(rectType, null, children)}
      </span>
    );
  }
  return undefined;
}
