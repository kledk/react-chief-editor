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

const Leaf = memo((props: RenderLeafProps) => {
  const { attributes, ...rest } = props;
  console.log(rest);
  return (
    <span
      style={{ backgroundColor: rest.leaf.highlight ? "yellow" : undefined }}
      {...attributes}
    />
  );
});
