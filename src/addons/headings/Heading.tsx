import React from "react";
import { useFocused, useSelected, useEditor } from "slate-react";
import { PlaceholderHint } from "../../placeholder-hint";
import { Editor } from "slate";
import { useLabels, ChiefRenderElementProps } from "../../chief";

export const Heading = (props: ChiefRenderElementProps) => {
  const editor = useEditor();
  const isFocused = useFocused();
  const isSelected = useSelected();
  const defaultPlaceholderTexts = {
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6"
  };
  const [getLabel] = useLabels();
  let placeholder = getLabel({
    key: `elements.heading.${props.element.type}.placeholder`,
    defaultLabel: defaultPlaceholderTexts[props.element.type]
  });

  return React.createElement(
    props.element.type,
    props.attributes,
    <PlaceholderHint
      isEmpty={Editor.isEmpty(editor, props.element)}
      placeholder={isFocused && isSelected ? placeholder : undefined}
    >
      {props.children}
    </PlaceholderHint>
  );
};
