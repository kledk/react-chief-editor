import {
  isBlockEmpty,
  getActiveNode,
  useOnClickOutside,
  getAncestor
} from "./utils";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Node, Editor, Range, Element } from "slate";
import { Manager, Reference, Popper } from "react-popper";
import styled from "styled-components";
import { CleanButton } from "./clean-button";
import { getState } from "./chief/chief-state";

export const BlockInsertBtn = styled(CleanButton)`
  user-select: none;
  border: none;
  background: transparent;
  display: block;
  width: 25px;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: ${25 / 2}px;
  span {
    font-size: 28px;
    color: #ccc;
    position: absolute;
    top: -6px;
    left: 4px;
    padding: 0;
    margin: 0;
    &:hover {
      color: #ddd;
    }
    &:active {
      color: #eee;
    }
  }
`;

export function BlockInsert(props: { children?: React.ReactNode }) {
  const editor = useSlate();
  const { selection } = editor;
  const activenode = getActiveNode(editor);
  const [coords, setCoords] = useState([-1000, -1000]);
  const [showMenu, setShowMenu] = useState(false);
  const toolboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(toolboxRef, () => {
    setShowMenu(false);
  });
  const handleBlockInsert = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setShowMenu(!showMenu);
      ReactEditor.focus(editor);
    },
    [showMenu]
  );
  useEffect(() => {
    setShowMenu(false);
    if (!ReactEditor.isFocused(editor)) {
      return;
    }
    if (activenode) {
      const [rootNode] = Editor.nodes(editor, {
        at: Editor.start(editor, [0, 0])
      });
      if (rootNode.length > 0 && Node.isNode(rootNode[0])) {
        const firstDOMPoint = ReactEditor.toDOMNode(editor, rootNode[0]);
        const activeDOMNode = ReactEditor.toDOMNode(editor, activenode);
        const rect = activeDOMNode.getBoundingClientRect();
        const top = rect.top + window.pageYOffset + rect.height / 2 - 25 / 2;
        const left =
          firstDOMPoint.getBoundingClientRect().left + window.pageXOffset - 30;
        setCoords([top, left]);
      }
    }
  }, [selection, activenode, editor]);

  if (
    !selection ||
    selection.anchor.path.length !== 2 ||
    Range.isExpanded(selection) ||
    Range.start(selection).offset !== 0 ||
    !isBlockEmpty(editor) ||
    Editor.isVoid(editor, activenode) ||
    !ReactEditor.isFocused(editor)
  ) {
    if (!showMenu) {
      return null;
    }
  }
  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div
            ref={ref}
            style={{ position: "absolute", top: coords[0], left: coords[1] }}
          >
            <BlockInsertBtn onClick={handleBlockInsert}>
              <span>+</span>
            </BlockInsertBtn>
          </div>
        )}
      </Reference>
      {showMenu && (
        <Popper
          placement="bottom-end"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [25, 10]
              }
            }
          ]}
        >
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={{ ...style, zIndex: 20 }}
              data-placement={placement}
            >
              <div ref={toolboxRef}>{props.children}</div>
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
}
