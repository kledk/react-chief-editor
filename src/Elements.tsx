import React from "react";
import { RenderElementProps } from "slate-react";
import { Paragraph } from "./elements/Paragraph";
import { Heading } from "./elements/Heading";
import { Link } from "./elements/link";
import { Image } from "./elements/image";

export function Elements(props: RenderElementProps) {
  switch (props.element.type) {
    case "heading-1":
    case "heading-2":
    case "heading-3":
    case "heading-4":
    case "heading-5":
      return <Heading {...props} />;
    case "link":
      return <Link {...props} />;
    case "image":
      return <Image {...props} />;
    default:
      return <Paragraph {...props} />;
  }
}
