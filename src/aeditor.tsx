import { getNodeFromSelection, getActiveNodeType } from "./utils";
import { isNodeActive, useOnClickOutside } from "./utils";
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
  ReactEditor,
  useFocused,
  useSelected
} from "slate-react";
import { withHistory } from "slate-history";
import {
  createEditor as createSlateEditor,
  Node,
  Editor,
  Text,
  Transforms,
  Range,
  Point,
  NodeEntry,
  Element,
  Path,
  Location
} from "slate";
import styled, { ThemeProvider } from "styled-components";
import { BlockInsert } from "./BlockInsert";
import { Addon } from "./addon";
import { insertLink, isLinkActive } from "./addons/link";
import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import { StyledToolbarBtn } from "./StyledToolbarBtn";
import { StyledToolBox } from "./StyledToolBox";
import { ToolDivider } from "./ToolDivider";
import { ToolsWrapper } from "./ToolsWrapper";
import { PlaceholderHint } from "./PlaceholderHint";

Transforms.deselect = () => {
  console.log("inside deselect method ");
};

export const defaultTheme = {
  preferDarkOption: false,
  darkTheme: {
    background: "#000",
    foreground: "#fff"
  },
  editor: { fontSize: 14, color: "rgb(55, 53, 47)" },
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
    match: n => Boolean(n[formatType])
  });
  return Boolean(match);
};

const isHeadingType = (editor: Editor, header: Heading) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === header
  });
  return Boolean(match);
};

export const RichEditor = {
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
  },
  insertLink: insertLink
};

const EditorThemeWrapper = styled.div`
  font-size: ${props => props.theme.editor.fontSize}px;
  ${props =>
    props.theme.preferDarkOption &&
    `
@media (prefers-color-scheme: dark) {
    background-color: ${props.theme.darkTheme.background};
    color: ${props.theme.darkTheme.foreground};
    & ::selection {
      color: white;
      background: #cbcbcb
    }
  }`}
`;

export function FormatBtn(props: {
  formatType: TextFormat;
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const isActive = isTextFormat(editor, props.formatType);
  return (
    <StyledToolbarBtn
      isActive={isActive}
      onClick={() => RichEditor.toggleFormat(editor, props.formatType)}
    >
      {props.children}
    </StyledToolbarBtn>
  );
}

export function HeadingBtn(props: {
  headingType: Heading;
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const isActive = isHeadingType(editor, props.headingType);
  return (
    <StyledToolbarBtn
      isActive={isActive}
      onClick={() => RichEditor.toggleHeading(editor, props.headingType)}
    >
      {props.children}
    </StyledToolbarBtn>
  );
}

function HoveringToolbars(props: { addons: Addon[] }) {
  const { addons } = props;
  const editor = useSlate();
  // const { selection } = useHoverTool();
  const {selection} = editor;
  if (selection) {
    const addonsForContext = addons.filter(addon => {
      if (addon.hoverMenu) {
        if (selection) {
          const [match] = Editor.nodes(editor, {
            match: n => {
              if (addon.hoverMenu?.typeMatch && typeof n.type === "string") {
                if (n.type.match(addon.hoverMenu.typeMatch)) {
                  return true;
                }
              } else if (
                !addon.hoverMenu?.typeMatch &&
                !Editor.isVoid(editor, n) &&
                typeof n.type === "string"
              ) {
                return true;
              }
              return false;
            },
            at: selection
          });
          return Boolean(match);
        } else {
          return false;
        }
      }
      return false;
    });
    if (addonsForContext.length > 0) {
      const orderedAddons = orderBy(addonsForContext, "contextMenu.order");
      const groupedAddons = groupBy(orderedAddons, "contextMenu.category");
      return (
        <StyledToolBox>
          <ToolsWrapper>
            {Object.entries(groupedAddons).map(([, orderedAddons]) => (
              <React.Fragment>
                {orderedAddons.map((it, i) => {
                  if (it.hoverMenu) {
                    const renderButton = it.hoverMenu.renderButton;
                    return typeof renderButton === "function"
                      ? renderButton()
                      : renderButton;
                  }
                  return null;
                })}
                <ToolDivider />
              </React.Fragment>
            ))}
          </ToolsWrapper>
        </StyledToolBox>
      );
    }
  }
  return null;
}

function BlockInsertTools() {
  const editor = useSlate();
  return (
    <StyledToolBox>
      <ToolsWrapper>
        <StyledToolbarBtn
          isActive={isNodeActive(editor, "heading-1")}
          onClick={() => {
            RichEditor.insertBlock(editor, "heading-1");
            ReactEditor.focus(editor);
          }}
        >
          H1
        </StyledToolbarBtn>
        <StyledToolbarBtn
          isActive={isNodeActive(editor, "heading-2")}
          onClick={() => {
            RichEditor.insertBlock(editor, "heading-2");
            ReactEditor.focus(editor);
          }}
        >
          H2
        </StyledToolbarBtn>
        <StyledToolbarBtn
          isActive={isNodeActive(editor, "heading-3")}
          onClick={() => {
            RichEditor.insertBlock(editor, "heading-3");
            ReactEditor.focus(editor);
          }}
        >
          H3
        </StyledToolbarBtn>
        <ToolDivider></ToolDivider>
        <StyledToolbarBtn
          isActive={isNodeActive(editor, "paragraph")}
          onClick={() => {
            RichEditor.insertBlock(editor, "paragraph");
            ReactEditor.focus(editor);
          }}
        >
          Text
        </StyledToolbarBtn>
        <ToolDivider></ToolDivider>
        <StyledToolbarBtn
          isActive={isNodeActive(editor, "image")}
          onClick={() => {
            RichEditor.insertBlock(editor, "image");
            ReactEditor.focus(editor);
          }}
        >
          Image
        </StyledToolbarBtn>
      </ToolsWrapper>
    </StyledToolBox>
  );
}

function Paragraph(props: RenderElementProps) {
  const editor = useSlate();
  const isFocused = useFocused();
  const isSelected = useSelected();
  return (
    <p {...props.attributes}>
      <PlaceholderHint
        isEmpty={Editor.isEmpty(editor, props.element)}
        hoverHint={"Click to start typing"}
        placeholder={isFocused && isSelected ? "Text" : undefined}
      >
        {React.Children.map(props.children, it => it)}
      </PlaceholderHint>
    </p>
  );
}

const handleRenderElement = (
  props: RenderElementProps,
  editor: ReactEditor,
  addons: Addon[]
) => {
  let element: JSX.Element | undefined;
  for (let addon of addons) {
    if (
      addon.element &&
      addon.element.renderElement &&
      addon.element.typeMatch &&
      (props.element?.type as string).match(addon.element.typeMatch)
    ) {
      element = addon.element.renderElement(props, editor) || element;
    }
  }

  return (element = element || <Paragraph {...props} />);
};

function handleRenderLeaf(
  props: RenderLeafProps,
  editor: ReactEditor,
  addons: Addon[]
) {
  let copy = { ...props };
  for (const addon of addons) {
    if (addon.renderLeaf) {
      const leaf = addon.renderLeaf(copy, editor);
      if (leaf) {
        copy = { ...copy, children: leaf };
      }
    }
  }
  return <span {...copy.attributes}>{copy.children}</span>;
}

const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: ReactEditor,
  addons: Addon[]
) => {
  for (let addon of addons) {
    if (addon.onKeyDown) {
      if (addon.onKeyDown(event, editor)) {
        // On true, we break out of the onKeyDown loop
        return;
      }
    }
  }
};

const handleKeyUp = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: ReactEditor,
  addons: Addon[]
) => {
  const { selection } = editor;
  if (!selection) {
    return;
  }
  const [node, path] = Editor.node(editor, selection as Location);
  if (!path.length) {
    return;
  }
  const [parent] = Editor.parent(editor, path);
  if (parent) {
    // TODO: implement some kind of trigger
    // for (let addon of addons) {
    //   if (addon.triggers) {
    //     for (let trigger of plugin.triggers) {
    //       const matches = findMatches(trigger.pattern, trigger.range, editor);
    //       if (matches.length) {
    //         plugin.onTrigger && plugin.onTrigger(editor, matches, trigger);
    //         return;
    //       }
    //     }
    //   }
    // }
  }
};

const handleClick = (
  event: React.MouseEvent<HTMLElement>,
  editor: ReactEditor,
  addons: Addon[]
) => {
  addons.forEach(addon => {
    if (addon.onClick) {
      addon.onClick(event, editor);
    }
  });
};

const handleDecorate = (
  entry: NodeEntry,
  editor: ReactEditor,
  addons: Addon[]
) => {
  let ranges: Range[] = [];
  for (let addon of addons) {
    if (addon.decorate) {
      const result = addon.decorate(entry, editor);
      if (result) {
        return (ranges = ranges.concat(result));
      }
    }
  }
  return ranges;
};

const createEditor = (addons: Addon[]): ReactEditor => {
  return useMemo(() => {
    let editor: ReactEditor = withHistory(withReact(createSlateEditor()));
    addons.forEach(addon => {
      if (addon.withPlugin) {
        editor = addon.withPlugin(editor);
      }
    });
    editor.replaceNode = (element: Node, replacement: Node) => {
      const at = ReactEditor.findPath(editor, element);
      Transforms.select(editor, at);
      Transforms.unwrapNodes(editor, { at });
      Transforms.delete(editor);
      Editor.insertNode(editor, replacement);
    };
    return editor;
  }, []);
};

export function Aeditor(
  props: {
    value: Node[];
    onChange: (value: Node[]) => void;
    theme?: AeditorTheme & { [key: string]: any };
    addons: Addon[];
  } & React.ComponentProps<typeof Editable>
) {
  const { value, onChange, theme, addons, ...otherProps } = props;
  const editor = createEditor(addons);

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      return handleRenderElement(props, editor, addons);
    },
    [addons]
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => {
      return handleRenderLeaf(props, editor, addons);
    },
    [addons]
  );

  const decorate = useCallback(
    (entry: NodeEntry) => handleDecorate(entry, editor, addons),
    []
  );

  const keyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    return handleKeyDown(event, editor, addons);
  }, []);

  const keyUp = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    handleKeyUp(event, editor, addons);
  }, []);

  const click = useCallback(
    (event: React.MouseEvent<HTMLElement>) =>
      handleClick(event, editor, addons),
    []
  );

  const paste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = event.clipboardData;
    const pastedData = clipboardData.getData("Text");
    if (!pastedData) {
      return;
    }
    editor.insertText(pastedData);
  }, []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <ThemeProvider theme={{ ...defaultTheme, ...theme }}>
        <HoverToolProvider hoverTool={<HoveringToolbars addons={addons} />}>
          {editableProps => (
            <div
              style={{
                marginLeft: 20
              }}
            >
              <BlockInsert>
                <BlockInsertTools />
              </BlockInsert>
              <EditorThemeWrapper>
                <Editable
                  {...editableProps}
                  renderLeaf={renderLeaf}
                  renderElement={renderElement}
                  decorate={decorate}
                  onKeyDown={keyDown}
                  onKeyUp={keyUp}
                  onClick={click}
                  onPaste={paste}
                  {...otherProps}
                />
              </EditorThemeWrapper>
            </div>
          )}
        </HoverToolProvider>
      </ThemeProvider>
    </Slate>
  );
}
