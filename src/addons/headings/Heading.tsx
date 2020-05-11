import React from "react";
import {
  RenderElementProps,
  useSlate,
  useFocused,
  useSelected
} from "slate-react";
import { PlaceholderHint } from "../../placeholder-hint";
import { Editor } from "slate";

export const Heading = (props: RenderElementProps) => {
  const editor = useSlate();
  const isFocused = useFocused();
  const isSelected = useSelected();
  let heading = null;
  let placeholder = "";
  switch (props.element.type) {
    case "heading-1":
      heading = "h1";
      placeholder = "Heading 1";
      break;
    case "heading-2":
      heading = "h2";
      placeholder = "Heading 2";
      break;
    case "heading-3":
      heading = "h3";
      placeholder = "Heading 3";
      break;
    case "heading-4":
      heading = "h4";
      placeholder = "Heading 4";
      break;
    case "heading-5":
      heading = "h5";
      placeholder = "Heading 5";
      break;
    case "heading-6":
      heading = "h6";
      placeholder = "Heading 6";
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
