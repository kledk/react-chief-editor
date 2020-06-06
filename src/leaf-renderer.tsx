import React, { memo, ReactNode } from "react";
import { RenderLeafProps } from "slate-react";

export function renderLeaf(
  props: RenderLeafProps,
  leafType: string,
  rectType: string
) {
  const { children, leaf } = props;
  if (leaf[leafType]) {
    return (
      <Leaf {...props}>{React.createElement(rectType, null, children)}</Leaf>
    );
  }
  return undefined;
}

const Leaf = (props: RenderLeafProps) => {
  const { attributes, children } = props;
  return <span {...attributes} children={children} />;
};
