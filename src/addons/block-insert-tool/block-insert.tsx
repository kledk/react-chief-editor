import { useOnClickOutside } from "../../utils";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Node, Editor, Path, Transforms } from "slate";
import { Manager, Reference, Popper } from "react-popper";
import styled from "styled-components";
import { ButtonBase } from "../../ui/button-base";

export const BlockInsertBtn = styled(ButtonBase)`
  @media print {
    display: none;
  }
  user-select: none;
  border: none;
  background: transparent;
  display: block;
  width: 25px;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: ${25 / 2}px;
  &:before {
    content: "+";
    font-family: Arial, Helvetica, sans-serif;
    font-weight: normal;
    font-size: 28px;
    color: #ccc;
    position: absolute;
    top: -3px;
    left: 4px;
    padding: 0;
    margin: 0;
  }
  &:hover {
    &:before {
      color: #ddd;
    }
  }
  &:active {
    &:before {
      color: #eee;
    }
  }
`;

function useHoveredNode(editor: ReactEditor) {
  const [node, setNode] = useState<{ node: Node; path: Path } | null>(null);
  useEffect(() => {
    try {
      const [rootNode] = Editor.node(editor, {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, [])
      });
      if (rootNode && Node.isNode(rootNode)) {
        const firstDOMPoint = ReactEditor.toDOMNode(editor, rootNode);
        firstDOMPoint.addEventListener("mousemove", e => {
          if (ReactEditor.hasDOMNode(editor, e.target as globalThis.Node)) {
            const node = ReactEditor.toSlateNode(
              editor,
              e.target as globalThis.Node
            );
            const path = ReactEditor.findPath(editor, node);
            setNode({ node, path });
          } else {
            setNode(null);
          }
        });
      }
    } catch (err) {
      setNode(null);
    }
  }, [editor]);
  return node;
}

export function BlockInsert(props: { children?: React.ReactNode }) {
  const editor = useSlate();
  const [coords, setCoords] = useState([-1000, -1000]);
  const [showMenu, setShowMenu] = useState(false);
  const toolboxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(toolboxRef, () => {
    setShowMenu(false);
  });

  const hoveredNode = useHoveredNode(editor);

  const handleBlockInsert = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!showMenu && hoveredNode) {
        Transforms.select(editor, hoveredNode.path);
      }
      setShowMenu(!showMenu);
      ReactEditor.focus(editor);
    },
    [showMenu, hoveredNode]
  );

  useEffect(() => {
    if (hoveredNode?.node && !showMenu) {
      try {
        const [rootNode] = Editor.node(editor, {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, [])
        });
        if (rootNode && Node.isNode(rootNode)) {
          const firstDOMPoint = ReactEditor.toDOMNode(editor, rootNode);
          const activeDOMNode = ReactEditor.toDOMNode(editor, hoveredNode.node);
          const rect = activeDOMNode.getBoundingClientRect();
          const top = rect.top + window.pageYOffset + rect.height / 2 - 25 / 2;
          const left =
            firstDOMPoint.getBoundingClientRect().left +
            window.pageXOffset -
            30;
          setCoords([top, left]);
        }
      } catch (err) {
        /*ignore*/
      }
    }
  }, [hoveredNode]);

  if (
    !hoveredNode ||
    hoveredNode.path.length === 0 ||
    Node.string(hoveredNode.node).length !== 0 ||
    Editor.isVoid(editor, hoveredNode.node)
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
            <BlockInsertBtn onClick={handleBlockInsert} />
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
              onMouseDown={e => {
                if (!e.isDefaultPrevented()) {
                  e.preventDefault();
                  setShowMenu(false);
                  ReactEditor.focus(editor);
                  editor.selection &&
                    Transforms.select(editor, editor.selection.focus);
                }
              }}
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
