import React from "react";
import { RenderElementProps, useFocused, useSelected } from "slate-react";
import { Element } from "slate";

export const isImageELement = (element: Element) => {
  return element.type === "image" && typeof element.url === "string";
};

export const Image = (props: RenderElementProps) => {
  const focused = useFocused();
  const selected = useSelected();
  return (
    <div {...props.attributes}>
      <div contentEditable={false}>
        <img
          style={{
            objectFit: "cover",
            width: "100%",
            display: "block",
            height: 400,
            outline:
              focused && selected ? "1px solid rgb(46, 170, 220)" : "none"
          }}
          alt={props.element.caption}
          src={props.element.url}
        ></img>
        {props.children}
      </div>
    </div>
  );
};
