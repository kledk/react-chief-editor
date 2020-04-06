import React from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range } from "slate";
import { Popper } from "react-popper";
import { VirtualElement } from "@popperjs/core";
import { useLastFocused } from "./utils";

class VirtualReference implements VirtualElement {
  getBoundingClientRect() {
    try {
      const domSelection = window.getSelection();
      const domRange = domSelection?.getRangeAt(0);
      if (!domRange) {
        throw new Error();
      }
      return domRange.getBoundingClientRect();
    } catch (err) {
      console.trace("Should not happen");
      return {
        top: -1000,
        left: -1000,
        bottom: 0,
        right: 0,
        width: 1,
        height: 1
      } as DOMRect;
    }
  }
}

export const HoveringTool = (
  props: { children: React.ReactNode } & React.HTMLProps<HTMLDivElement>
) => {
  const { children, ...otherProps } = props;
  const editor = useSlate();
  const { selection } = editor;
  const lastFocused = useLastFocused(editor);
  if (lastFocused.node) {
    const el = ReactEditor.toDOMNode(editor, lastFocused.node);
    // console.log(el)
  }
  
  // console.log(lastFocused);
  const enabled =
    selection &&
    ReactEditor.isFocused(editor) &&
    !Range.isCollapsed(selection) &&
    Editor.string(editor, selection) !== "";

  if (!enabled) {
    return null;
  }
  const virtualReferenceElement = new VirtualReference();
  return (
    <Popper
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 10]
          }
        }
      ]}
      placement="top"
      referenceElement={virtualReferenceElement}
    >
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          <div
            onMouseDown={e => {
              e.preventDefault();
            }}
            {...otherProps}
          >
            {children}
          </div>
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
  );
};
