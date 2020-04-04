import React from "react";
import { RenderElementProps } from "slate-react";
import { Element } from "slate";

export const isImageELement = (element: Element) => {
  return element.type === "image" && typeof element.url === "string";
};

export const Image = (props: RenderElementProps) => {
  return (
    <img
      style={{
        objectFit: "cover",
        width: "100%",
        display: "block",
        height: 400
      }}
      alt={props.element.caption}
      {...props.attributes}
      src={props.element.url}
    ></img>
  );
};
