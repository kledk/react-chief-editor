import React from "react";
import { RenderElementProps } from "slate-react";
import { Element } from "slate";

export const isLinkELement = (element: Element) => {
  return element.type === "link" && typeof element.url === "string";
};

export const Link = (props: RenderElementProps) => {
  return (
    <a {...props.attributes} href={props.element.url}>
      {props.children}
    </a>
  );
};
