import React from "react";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { Element } from "slate";
import { ParagraphElement } from "./paragraph-element";
import { useLabels, ChiefElement } from "../../chief";
import { AddonProps } from "../../addon";

export function ParagraphAddon({
  showHint = true,
  showPlaceholder = true,
  labels
}: {
  showHint?: boolean;
  showPlaceholder?: boolean;
} & AddonProps) {
  const [getLabel] = useLabels(labels);
  useRenderElement(
    {
      typeMatch: "paragraph",
      renderElement: props => (
        <ParagraphElement
          hint={
            showHint
              ? getLabel({
                  key: "elements.paragraph.hint",
                  defaultLabel: "Click to start typing"
                })
              : undefined
          }
          placeholder={
            showPlaceholder
              ? getLabel({
                  key: "elements.paragraph.placeholder",
                  defaultLabel: "Text"
                })
              : undefined
          }
          {...props}
        ></ParagraphElement>
      )
    },
    [getLabel]
  );
  return null;
}
