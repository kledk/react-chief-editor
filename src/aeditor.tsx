import { getNodeFromSelection } from "./utils";
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
  ReactEditor
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
  Path
} from "slate";
import styled, { ThemeProvider } from "styled-components";
import { BlockInsert } from "./BlockInsert";
import { Addon } from "./addon";
import { insertLink, isLinkActive } from "./addons/link";

export const defaultTheme = {
  preferDarkOption: false,
  darkTheme: {
    background: "#000",
    foreground: "#fff"
  },
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
  },
  insertLink: insertLink
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

export const BlockInsertBtn = styled(Button)`
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

const StyledToolbarBtn = styled(Button)<{ isActive?: boolean }>`
  background-color: white;
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
  ${props =>
    props.theme.preferDarkOption &&
    `
@media (prefers-color-scheme: dark) {
  background-color: grey;
  color: ${props.isActive ? "white" : undefined};
  &:hover {
    background-color: dimgrey;
  }
  &:active {
    background-color: darkgrey;
  }
  }`}
`;

const StyledToolBox = styled.div`
  background-color: white;
  overflow: hidden;
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
    rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
  ${props =>
    props.theme.preferDarkOption &&
    `
@media (prefers-color-scheme: dark) {
    background-color: ${props.theme.darkTheme.background};
  }`}
`;

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

const ToolDivider = styled.div`
  width: 1px;
  background-color: #f5f5f5;
  ${props =>
    props.theme.preferDarkOption &&
    `
@media (prefers-color-scheme: dark) {
  background-color: #737373;
  }`}
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
    <StyledToolbarBtn
      isActive={isActive}
      onClick={() => RichEditor.toggleFormat(editor, props.formatType)}
    >
      {props.children}
    </StyledToolbarBtn>
  );
}

function HeadingBtn(props: {
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

function ImageTools() {
  return (
    <TextFormatToolsWrapper>
      <LinkBtn>Delete</LinkBtn>
    </TextFormatToolsWrapper>
  );
}

function LinkPopup(props: { onClose: () => void }) {
  const editor = useSlate();
  const { saveSelection, perform, selection } = useHoverTool();
  useEffect(() => {
    return saveSelection();
  }, []);
  const linkWrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(linkWrapperRef, e => {
    e.preventDefault();
    props.onClose();
  });
  let linkNode: Node | null = null;
  if (selection?.current) {
    const [_linkNode] = Editor.nodes(editor, {
      at: selection.current,
      match: n => n.type === "link"
    });
    linkNode = _linkNode && _linkNode[0];
  }
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (linkNode) {
      setUrl(linkNode.url);
    }
  }, [linkNode]);
  const handleInsertLink = useCallback(() => {
    perform(() => {
      RichEditor.insertLink(editor, url);
      props.onClose();
    });
  }, [url]);

  return (
    <div
      ref={linkWrapperRef}
      style={{ padding: 9, display: "flex", minWidth: 300 }}
    >
      <InputWrapper>
        <input
          value={url}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setUrl(e.currentTarget.value)
          }
          placeholder="Insert link"
          autoFocus
          data-slate-editor
        />
      </InputWrapper>
      <StyledToolbarBtn onClick={handleInsertLink}>Link</StyledToolbarBtn>
      <StyledToolbarBtn onClick={props.onClose}>Unlink</StyledToolbarBtn>
    </div>
  );
}

function LinkBtn(props: { children: React.ReactNode }) {
  const editor = useSlate();
  const isActive = isLinkActive(editor);
  const { useToolWindow } = useHoverTool();
  const Toolwindow = useToolWindow();
  return (
    <Toolwindow
      renderContent={setShow => (
        <StyledToolBox>
          <LinkPopup onClose={() => setShow(false)}></LinkPopup>
        </StyledToolBox>
      )}
      renderToolBtn={(tprops, show) => (
        <StyledToolbarBtn {...tprops} isActive={isActive || show}>
          {props.children}
        </StyledToolbarBtn>
      )}
    />
  );
}

function HoveringToolbars() {
  const editor = useSlate();
  const { selection } = useHoverTool();
  if (selection && selection.current) {
    const node = getNodeFromSelection(editor, selection.current);
    switch (node?.type) {
      case "image":
        return (
          <StyledToolBox>
            <ImageTools />
          </StyledToolBox>
        );
      default:
        return (
          <StyledToolBox>
            <TextFormatTools />
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
      <TextFormatToolsWrapper>
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
      </TextFormatToolsWrapper>
    </StyledToolBox>
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

const handleRenderElement = (
  props: RenderElementProps,
  editor: ReactEditor,
  addons: Addon[]
) => {
  let element: JSX.Element | undefined;

  for (let addon of addons) {
    if (addon.renderElement) {
      element = addon.renderElement(props, editor) || element;
    }
  }
  element = element || <p {...props.attributes}>{[props.children]}</p>;

  return element;
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

const createEditor = (addons: Addon[]): ReactEditor => {
  return useMemo(() => {
    let editor: ReactEditor = withAeditor(
      withHistory(withReact(createSlateEditor()))
    );
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

  const renderElement = useCallback((props: RenderElementProps) => {
    return handleRenderElement(props, editor, addons);
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return handleRenderLeaf(props, editor, addons);
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
                  decorate={handleDecorate}
                  onKeyDown={handleKeyDown}
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
