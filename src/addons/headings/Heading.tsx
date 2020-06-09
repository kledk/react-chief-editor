import React from "react";
import { useFocused, useSelected, useEditor } from "slate-react";
import { PlaceholderHint } from "../../placeholder-hint";
import { Editor } from "slate";
import { useLabels, ChiefRenderElementProps } from "../../chief";

export const Heading = (props: ChiefRenderElementProps) => {
  const editor = useEditor();
  const isFocused = useFocused();
  const isSelected = useSelected();
  const placeholderTexts = {
    "heading-1": "Heading 1",
    "heading-2": "Heading 2",
    "heading-3": "Heading 3",
    "heading-4": "Heading 4",
    "heading-5": "Heading 5",
    "heading-6": "Heading 6"
  };
  let heading = null;
  const [getLabel] = useLabels();
  let placeholder = getLabel({
    key: `elements.heading.${props.element.type}.placeholder`,
    defaultLabel: placeholderTexts[props.element.type]
  });
  switch (props.element.type) {
    case "heading-1":
      heading = "h1";
      break;
    case "heading-2":
      heading = "h2";
      break;
    case "heading-3":
      heading = "h3";
      break;
    case "heading-4":
      heading = "h4";
      break;
    case "heading-5":
      heading = "h5";
      break;
    case "heading-6":
      heading = "h6";
      break;
    default:
      return null;
  }

  return React.createElement(
    heading,
    props.attributes,
    <PlaceholderHint
      isEmpty={Editor.isEmpty(editor, props.element)}
      placeholder={isFocused && isSelected ? placeholder : undefined}
    >
      {props.children}
    </PlaceholderHint>
  );
};
