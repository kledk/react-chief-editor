import React, { memo, ReactNode } from "react";
import { RenderLeafProps } from "slate-react";

export function renderLeaf(
  props: RenderLeafProps,
  leafType: string,
  rectType: string
) {
  const { attributes, children, leaf } = props;
  if (leaf[leafType]) {
    return (
      <Leaf attributes={attributes}>
        {React.createElement(rectType, null, children)}
      </Leaf>
    );
  }
  return undefined;
}

const Leaf = memo(
  (props: {
    attributes: RenderLeafProps["attributes"];
    children: ReactNode;
  }) => {
    const { attributes, ...rest } = props;
    return <span {...attributes} {...rest} />;
  }
);
