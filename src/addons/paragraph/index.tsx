import React from "react";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { Element } from "slate";
import { ParagraphElement } from "./paragraph-element";

export function ParagraphAddon({
  type = "paragraph",
  hint = "Click to start typing",
  placeholder = "Text"
}: {
  /**Override the internal type for the paragraph*/
  type?: string;
  hint?: string;
  placeholder?: string;
}) {
  useRenderElement<{ type: typeof type } & Element>({
    typeMatch: type,
    renderElement: props => (
      <ParagraphElement
        hint={hint}
        placeholder={placeholder}
        {...props}
      ></ParagraphElement>
    )
  });
  return null;
}
