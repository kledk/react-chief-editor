import React from "react";
import { RenderElementProps } from "slate-react";

export const Heading = (props: RenderElementProps) => {
  switch (props.element.type) {
    case "heading-1":
      return <h1 {...props.attributes}>{props.children}</h1>;
    case "heading-2":
      return <h2 {...props.attributes}>{props.children}</h2>;
    case "heading-3":
      return <h3 {...props.attributes}>{props.children}</h3>;
    case "heading-4":
      return <h4 {...props.attributes}>{props.children}</h4>;
    case "heading-5":
      return <h5 {...props.attributes}>{props.children}</h5>;
    default:
      return null;
  }
};
