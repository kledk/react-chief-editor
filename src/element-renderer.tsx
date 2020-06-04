import React from "react";
import { RenderElementProps } from "slate-react";

export const renderElement = (
  props: RenderElementProps,
  elementType: string,
  reactType: Parameters<typeof React.createElement>["0"],
  addionalProps?: any
) => {
  const { children, attributes, element } = props;
  if (element.type === elementType) {
    return React.createElement(
      reactType,
      { ...attributes, ...addionalProps },
      children
    );
  }
  return undefined;
};
