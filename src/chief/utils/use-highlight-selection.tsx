import React from "react";
import { Range, Node } from "slate";
import { useDecoration } from "../hooks/use-decoration";
import { useRenderLeaf } from "..";

export function useHighlightSelection(
  selection: Range | null | undefined,
  style: React.CSSProperties) {
  useRenderLeaf(
    {
      renderLeaf: props => {
        return (
          <span
            style={props.leaf.highlightSelection ? style : undefined}
            {...props.attributes}
          >
            {props.children}
          </span>
        );
      }
    },
    [selection]
  );

  useDecoration(
    {
      decorator: ([node]) => {
        const ranges: Range[] = [];
        if (selection && Node.has(node, selection.anchor.path)) {
          ranges.push({ ...selection, highlightSelection: true });
        }
        return ranges;
      }
    },
    [selection]
  );
}
