import groupBy from "lodash/groupBy";
import merge from "lodash/merge";
import orderBy from "lodash/orderBy";
import React, { useCallback, useMemo } from "react";
import {
  createEditor as createSlateEditor,
  Editor,
  Location,
  Node,
  NodeEntry,
  Range,
  Text,
  Transforms
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useFocused,
  useSelected,
  useSlate,
  withReact
} from "slate-react";
import styled, { ThemeProvider } from "styled-components";
import { isDefined } from "ts-is-present";
import { Addon } from "./addon";
import { BlockInsert } from "./BlockInsert";
import { HoverToolProvider } from "./HoveringTool";
import { PlaceholderHint } from "./PlaceholderHint";
import { StyledToolbarBtn } from "./StyledToolbarBtn";
import { StyledToolBox } from "./StyledToolBox";
import { ToolDivider } from "./ToolDivider";
import { ToolsWrapper } from "./ToolsWrapper";
import { isNodeActive } from "./utils";

export const deselect = Transforms.deselect;
Transforms.deselect = () => {
  // We disable the default deselect.
};

export type AeditorTheme = {
  preferDarkOption: boolean;
  darkTheme: {
    background: string;
    foreground: string;
  };
  editor: React.CSSProperties;
  colors: {};
};

export const defaultTheme: AeditorTheme = {
  preferDarkOption: false,
  darkTheme: {
    background: "#000",
    foreground: "#fff"
  },
  editor: { fontSize: 14 },
  colors: {}
};

const isTextFormat = (editor: Editor, formatType: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => Boolean(n[formatType])
  });
  return Boolean(match);
};

export const RichEditor = {
  ...ReactEditor,
  toggleFormat(editor: Editor, format: string) {
    let isFormatted = isTextFormat(editor, format);
    Transforms.setNodes(
      editor,
      { [format]: !isFormatted },
      { match: n => Text.isText(n), split: true }
    );
  },
  insertHeader(editor: Editor, heading: string) {
    Transforms.insertNodes(editor, {
      type: heading,
      children: [{ text: "" }]
    });
  },
  insertBlock(editor: Editor, blockType: string) {
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

const EditorThemeWrapper = styled.div`
  ${props => ({ ...props.theme.editor })}
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
  formatType: string;
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

function HoveringToolbars(props: { addons: Addon[] }) {
  const { addons } = props;
  const editor = useSlate();
  // const { selection } = useHoverTool();
  const { selection } = editor;
  if (selection) {
    const buttons = addons
      .map(it => it.hoverMenu)
      .filter(isDefined)
      .filter(hoverMenu => {
        const [match] = Editor.nodes(editor, {
          match: n => {
            if (hoverMenu?.typeMatch && typeof n.type === "string") {
              if (n.type.match(hoverMenu.typeMatch)) {
                return true;
              }
            } else if (
              !hoverMenu?.typeMatch &&
              !Editor.isVoid(editor, n) &&
              typeof n.type === "string"
            ) {
              return true;
            }
            return false;
          }
        });
        return Boolean(match);
      });
    if (buttons.length > 0) {
      const ordered = orderBy(buttons, "order");
      const grouped = groupBy(ordered, "category");
      return (
        <StyledToolBox>
          <ToolsWrapper>
            {Object.entries(grouped).map(([, orderedAddons]) => (
              <React.Fragment>
                {orderedAddons.map((it, i) => {
                  if (it) {
                    const renderButton = it.renderButton;
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

function BlockInsertTools(props: { addons: Addon[] }) {
  const editor = useSlate();
  const buttons = props.addons.map(it => it.blockInsertMenu).filter(isDefined);
  if (buttons.length > 0) {
    const ordered = orderBy(buttons, "order");
    const grouped = groupBy(ordered, "category");
    return (
      <StyledToolBox>
        <ToolsWrapper>
          {Object.entries(grouped).map(([, buttons]) => (
            <React.Fragment>
              {buttons.map((it, i) => {
                if (it) {
                  const renderButton = it.renderButton;
                  return typeof renderButton === "function"
                    ? renderButton(editor)
                    : renderButton;
                }
                return null;
              })}
              <ToolDivider />
            </React.Fragment>
          ))}
          <StyledToolbarBtn
            isActive={isNodeActive(editor, "paragraph")}
            onClick={() => {
              RichEditor.insertBlock(editor, "paragraph");
              ReactEditor.focus(editor);
            }}
          >
            Text
          </StyledToolbarBtn>
        </ToolsWrapper>
      </StyledToolBox>
    );
  }
  return null;
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

  const _theme = merge({}, defaultTheme, theme);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <ThemeProvider theme={_theme}>
        <HoverToolProvider hoverTool={<HoveringToolbars addons={addons} />}>
          {editableProps => (
            <div
              style={{
                marginLeft: 20
              }}
            >
              <BlockInsert>
                <BlockInsertTools addons={addons} />
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
