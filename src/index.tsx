import {
  isBlockEmpty,
  isNodeActive,
  getActiveNode,
  useOnClickOutside
} from "./utils";
import { HoverToolProvider, useHoverTool } from "./HoveringTool";
import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef
} from "react";
import {
  withReact,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  Editable,
  useSlate,
  ReactEditor
} from "slate-react";
import { withHistory } from "slate-history";
import {
  createEditor,
  Node,
  Editor,
  Text,
  Transforms,
  Range,
  Point,
  NodeEntry,
  Element,
  Path
} from "slate";
import { Elements } from "./Elements";
import { Leafs } from "./Leafs";
import { HoveringTool } from "./HoveringTool";
import styled, { ThemeProvider } from "styled-components";
import { withLinks, isLinkActive } from "./plugins/with-links";
import { Manager, Reference, Popper } from "react-popper";

export const defaultTheme = {
  editor: { fontSize: 14 },
  colors: {}
};

export type AeditorTheme = typeof defaultTheme;

type TextFormat = "bold" | "italic" | "underline" | "strikethrough";
type Heading =
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6";

type Link = "link";

type Image = "image";

type Paragraph = "paragraph";

type BlockType = Heading | Link | Image | Paragraph;

const isTextFormat = (editor: Editor, formatType: TextFormat) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[formatType]
  });
  return Boolean(match);
};

const isHeadingType = (editor: Editor, header: Heading) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === header
  });
  return Boolean(match);
};

const RichEditor = {
  ...Editor,
  toggleFormat(editor: Editor, format: TextFormat) {
    let isFormatted = isTextFormat(editor, format);
    Transforms.setNodes(
      editor,
      { [format]: !isFormatted },
      { match: n => Text.isText(n), split: true }
    );
  },
  toggleHeading(editor: Editor, heading: Heading) {
    const isHeaderOfType = isHeadingType(editor, heading);
    if (isHeaderOfType) {
      Transforms.setNodes(editor, {
        type: "paragraph"
      });
    } else {
      Transforms.setNodes(editor, {
        type: heading
      });
    }
  },
  insertHeader(editor: Editor, heading: Heading) {
    Transforms.insertNodes(editor, {
      type: heading,
      children: [{ text: "" }]
    });
  },
  insertBlock(editor: Editor, blockType: BlockType) {
    if (!isNodeActive(editor, blockType)) {
      Transforms.setNodes(editor, {
        type: blockType,
        children: [{ text: "" }]
      });
    } else {
      Transforms.insertNodes(editor, {
        type: blockType,
        children: [{ text: "" }]
      });
    }
  }
};

const Button = styled.button`
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const BlockInsertBtn = styled(Button)`
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

const ToolbarBtn = styled(Button)<{ isActive?: boolean }>`
  &:hover {
    background-color: #ddd;
  }
  &:active {
    background-color: #eee;
  }
  &:first-child {
    padding-left: 10px;
  }
  &:last-child {
    padding-right: 10px;
  }
  padding: 8px;
  color: ${props => (props.isActive ? "rgb(46, 170, 220)" : undefined)};
  border: none;
`;

const ToolBox = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
    rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
`;

const EditorThemeWrapper = styled.div`
  font-size: ${props => props.theme.editor.fontSize}px;
`;

const ToolDivider = styled.div`
  width: 1px;
  background-color: #f5f5f5;
`;

const TextFormatToolsWrapper = styled.div`
  display: flex;
`;

function FormatBtn(props: {
  formatType: TextFormat;
  children: React.ReactNode;
}) {
  const { selection } = useHoverTool();
  const editor = useSlate();
  const isActive = isTextFormat(editor, props.formatType);
  return (
    <ToolbarBtn
      isActive={isActive}
      onClick={() => RichEditor.toggleFormat(editor, props.formatType)}
    >
      {props.children}
    </ToolbarBtn>
  );
}

function HeadingBtn(props: {
  headingType: Heading;
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const { selection } = useHoverTool();
  const isActive = isHeadingType(editor, props.headingType);
  return (
    <ToolbarBtn
      isActive={isActive}
      onClick={() => RichEditor.toggleHeading(editor, props.headingType)}
    >
      {props.children}
    </ToolbarBtn>
  );
}

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 10px;
  position: relative;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset,
    rgba(15, 15, 15, 0.1) 0px 1px 1px inset;
  background: rgba(242, 241, 238, 0.6);
  cursor: text;
  flex-grow: 1;
  flex-shrink: 1;
  margin-right: 8px;
  input {
    &:focus {
      outline: 0;
    }
    font-size: inherit;
    line-height: inherit;
    border: none;
    background: none;
    width: 100%;
    display: block;
    resize: none;
    padding: 0px;
  }
`;

function TextFormatTools() {
  return (
    <TextFormatToolsWrapper>
      <FormatBtn formatType="bold">B</FormatBtn>
      <FormatBtn formatType="italic">I</FormatBtn>
      <FormatBtn formatType="underline">U</FormatBtn>
      <FormatBtn formatType="strikethrough">S</FormatBtn>
      <ToolDivider></ToolDivider>
      <HeadingBtn headingType="heading-1">H1</HeadingBtn>
      <HeadingBtn headingType="heading-2">H2</HeadingBtn>
      <ToolDivider></ToolDivider>
      <LinkBtn>Link</LinkBtn>
    </TextFormatToolsWrapper>
  );
}

function LinkPopup(props: { onClose: () => void }) {
  const hoverTool = useHoverTool();
  useEffect(() => {
    return hoverTool.saveSelection();
  }, []);
  const linkWrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(linkWrapperRef, () => props.onClose());
  return (
    <div
      ref={linkWrapperRef}
      style={{ padding: 9, display: "flex", minWidth: 300 }}
    >
      <InputWrapper>
        <input placeholder="Insert link" autoFocus data-slate-editor />
      </InputWrapper>
      <ToolbarBtn onClick={props.onClose}>Link</ToolbarBtn>
      <ToolbarBtn>Unlink</ToolbarBtn>
    </div>
  );
}

function LinkBtn(props: { children: React.ReactNode }) {
  const editor = useSlate();
  const isActive = isLinkActive(editor);
  const [showLinkConfig, setShowLinkConfig] = useState(false);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <ToolbarBtn
            ref={ref}
            isActive={isActive || showLinkConfig}
            onClick={() => setShowLinkConfig(!showLinkConfig)}
          >
            {props.children}
          </ToolbarBtn>
        )}
      </Reference>
      <Popper
        placement="bottom"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [-100, 10]
            }
          }
        ]}
      >
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={style} data-placement={placement}>
            {showLinkConfig && (
              <ToolBox>
                <LinkPopup onClose={() => setShowLinkConfig(false)}></LinkPopup>
              </ToolBox>
            )}
            <div ref={arrowProps.ref} style={arrowProps.style} />
          </div>
        )}
      </Popper>
    </Manager>
  );
}

function HoveringToolbars() {
  return (
    <ToolBox>
      <TextFormatTools />
    </ToolBox>
  );
}

function BlockInsert() {
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
            <div ref={ref} style={style} data-placement={placement}>
              {
                <ToolBox ref={toolboxRef}>
                  <TextFormatToolsWrapper>
                    <ToolbarBtn
                      isActive={isNodeActive(editor, "heading-1")}
                      onClick={() => {
                        RichEditor.insertBlock(editor, "heading-1");
                        ReactEditor.focus(editor);
                      }}
                    >
                      H1
                    </ToolbarBtn>
                    <ToolbarBtn
                      isActive={isNodeActive(editor, "heading-2")}
                      onClick={() => {
                        RichEditor.insertBlock(editor, "heading-2");
                        ReactEditor.focus(editor);
                      }}
                    >
                      H2
                    </ToolbarBtn>
                    <ToolbarBtn
                      isActive={isNodeActive(editor, "heading-3")}
                      onClick={() => {
                        RichEditor.insertBlock(editor, "heading-3");
                        ReactEditor.focus(editor);
                      }}
                    >
                      H3
                    </ToolbarBtn>
                    <ToolDivider></ToolDivider>
                    <ToolbarBtn
                      isActive={isNodeActive(editor, "paragraph")}
                      onClick={() => {
                        RichEditor.insertBlock(editor, "paragraph");
                        ReactEditor.focus(editor);
                      }}
                    >
                      Text
                    </ToolbarBtn>
                    <ToolDivider></ToolDivider>
                    <ToolbarBtn
                      isActive={isNodeActive(editor, "image")}
                      onClick={() => {
                        RichEditor.insertBlock(editor, "image");
                        ReactEditor.focus(editor);
                      }}
                    >
                      Image
                    </ToolbarBtn>
                  </TextFormatToolsWrapper>
                </ToolBox>
              }
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
}

function withAeditor<T extends Editor>(editor: T): T {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
    const [isParagraph] = Editor.nodes(editor, {
      match: n => n.type === "paragraph"
    });
    if (
      !isParagraph &&
      editor.selection &&
      editor.selection.focus.offset === 0
    ) {
      return Transforms.setNodes(editor, { type: "paragraph" });
    }
    return deleteBackward(unit);
  };

  return editor;
}

function withImages<T extends Editor>(editor: T): T {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element: Element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === "image") {
      let previous = Editor.previous(editor, { at: path });
      if (previous) {
        const [previousNode, previousPath] = previous;
        if (Element.isElement(previousNode) && editor.isVoid(previousNode)) {
          Transforms.insertNodes(
            editor,
            {
              type: "paragraph",
              children: [{ text: "1" }]
            },
            { at: Path.next(previousPath) }
          );
        }
      }
      let next = Editor.next(editor, { at: path });
      if (next) {
        const [nextNode, nextPath] = next;
        if (Element.isElement(nextNode) && editor.isVoid(nextNode)) {
          Transforms.insertNodes(
            editor,
            {
              type: "paragraph",
              children: [{ text: "2" }]
            },
            { at: Path.next(nextPath) }
          );
        }
      } else {
        Transforms.insertNodes(
          editor,
          {
            type: "paragraph",
            children: [{ text: "3" }]
          },
          { at: Path.next(path) }
        );
      }
    } else {
      normalizeNode(entry);
    }
  };

  return editor;
}

export function Aeditor(
  props: {
    value: Node[];
    onChange: (value: Node[]) => void;
    theme?: AeditorTheme & { [key: string]: any };
  } & React.ComponentProps<typeof Editable>
) {
  const { value, onChange, theme, ...otherProps } = props;
  const editor = useMemo(
    () =>
      withAeditor(
        withImages(withLinks(withHistory(withReact(createEditor()))))
      ),
    []
  );

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Elements {...props} />;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leafs {...props} />;
  }, []);
  const handleDecorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: any[] = [];
    return ranges;
  }, []);
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.keyCode === 13) {
        // Enter key
        if (event.shiftKey) {
          editor.insertText("\n");
          event.preventDefault();
        }
        const { selection } = editor;
        if (selection && selection.focus.offset !== 0) {
          const [match] = Editor.nodes(editor, {
            match: n => n.type?.match(/(heading)/)
          });
          if (match) {
            event.preventDefault();
            Transforms.insertNodes(editor, {
              type: "paragraph",
              children: [{ text: "" }]
            });
          }
        }
      }
      if (event.key === "b" && event.ctrlKey) {
        event.preventDefault();
        RichEditor.toggleFormat(editor, "bold");
      }
      if (event.key === "i" && event.ctrlKey) {
        event.preventDefault();
        RichEditor.toggleFormat(editor, "italic");
      }
    },
    [editor]
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <ThemeProvider theme={{ ...defaultTheme, ...theme }}>
        <HoverToolProvider hoverTool={<HoveringToolbars />}>
          <div
            style={{
              marginLeft: 20
            }}
          >
            <BlockInsert />
            <EditorThemeWrapper>
              <Editable
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                decorate={handleDecorate}
                onKeyDown={handleKeyDown}
                {...otherProps}
              />
            </EditorThemeWrapper>
          </div>
        </HoverToolProvider>
      </ThemeProvider>
    </Slate>
  );
}
