import React from "react";
import { Editor as SlateEditor, Range } from "slate";
import {
  RenderElementProps,
  useFocused,
  useSelected,
  useSlate
} from "slate-react";
import { PlaceholderHint } from "../../placeholder-hint";
import { ChiefRenderElementProps } from "../../chief/chief";

export function ParagraphElement(
  props: ChiefRenderElementProps & { placeholder?: string; hint?: string }
) {
  const editor = useSlate();
  const isFocused = useFocused();
  const isSelected = useSelected();
  return (
    <p {...props.attributes}>
      <PlaceholderHint
        isEmpty={SlateEditor.isEmpty(editor, props.element)}
        hoverHint={props.hint}
        placeholder={isFocused && isSelected ? props.placeholder : undefined}
      >
        {React.Children.map(props.children, it => it)}
      </PlaceholderHint>
    </p>
  );
}
