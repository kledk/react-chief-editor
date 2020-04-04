import {} from "./HoveringTool";
import React, { useMemo, useState, useCallback, useEffect } from "react";
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
import { createEditor, Node, Editor, Text, Transforms } from "slate";
import { Elements } from "./Elements";
import { Leafs } from "./Leafs";
import { HoveringTool } from "./HoveringTool";
import styled, { ThemeProvider } from "styled-components";
import { withLinks, isLinkActive } from "./plugins/with-links";
import { Manager, Reference, Popper } from "react-popper";

export const defaultTheme = {
  editor: { fontSize: 14 }
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

const isTextFormat = (editor: Editor, formatType: TextFormat) => {
  const [match] = Editor.nodes(editor, { match: n => n[formatType] });
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
  insertHeader(editor: Editor, heading: Heading) {
    Transforms.insertNodes(editor, {
      type: heading,
      children: [{ text: "" }]
    });
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
  padding: 8px;
  border: none;
  background: transparent;
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

const StyledTool = styled.div`
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

function TextFormatTools() {
  return (
    <TextFormatToolsWrapper>
      <FormatBtn formatType="bold">B</FormatBtn>
      <FormatBtn formatType="italic">I</FormatBtn>
      <FormatBtn formatType="underline">U</FormatBtn>
      <FormatBtn formatType="strikethrough">S</FormatBtn>
      <ToolDivider></ToolDivider>
      <LinkBtn>Link</LinkBtn>
    </TextFormatToolsWrapper>
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
            isActive={isActive}
            onClick={() => setShowLinkConfig(!showLinkConfig)}
          >
            {props.children}
          </ToolbarBtn>
        )}
      </Reference>
      <Popper placement="bottom">
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={style} data-placement={placement}>
            {showLinkConfig && (
              <StyledTool>
                <input autoFocus data-slate-editor></input>
              </StyledTool>
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
    <StyledTool>
      <TextFormatTools />
    </StyledTool>
  );
}

function BlockInsert() {
  const editor = useSlate();
  const { selection } = editor;

  const [coords, setCoords] = useState([-1000, -1000]);
  const [showMenu, setShowMenu] = useState(false);

  const handleBlockInsert = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      setShowMenu(!showMenu);
    },
    [showMenu]
  );

  useEffect(() => {
    if (!ReactEditor.isFocused(editor)) {
      return;
    }
    setShowMenu(false);
    if (selection) {
      const domRange = ReactEditor.toDOMRange(editor, selection);
      const rect = domRange?.getBoundingClientRect();
      const top = rect.top + window.pageYOffset;
      setCoords([top]);
    }
  }, [editor, selection]);

  // if (
  //   (selection && Range.isExpanded(selection)) ||
  //   !ReactEditor.isFocused(editor)
  // ) {
  //   return null;
  // }

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div style={{ position: "absolute", top: coords[0], left: 0 }}>
            <BlockInsertBtn ref={ref} onClick={handleBlockInsert}>
              <span>🖊</span>
            </BlockInsertBtn>
          </div>
        )}
      </Reference>
      {showMenu && (
        <Popper placement="right">
          {({ ref, style, placement, arrowProps }) => (
            <div ref={ref} style={style} data-placement={placement}>
              {
                <StyledTool>
                  <ToolbarBtn
                    onClick={() => {
                      RichEditor.insertHeader(editor, "heading-1");
                      ReactEditor.focus(editor);
                    }}
                  >
                    H1
                  </ToolbarBtn>
                  <ToolbarBtn>H2</ToolbarBtn>
                  <ToolbarBtn>H3</ToolbarBtn>
                </StyledTool>
              }
              <div ref={arrowProps.ref} style={arrowProps.style} />
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
}

export function Aeditor(props: {
  value: Node[];
  onChange: (value: Node[]) => void;
  theme?: AeditorTheme & { [key: string]: any };
}) {
  const { value, onChange } = props;
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  );

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Elements {...props} />;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leafs {...props} />;
  }, []);
  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === "Enter") {
        const { selection } = editor;
        if (selection) {
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
      <ThemeProvider theme={{ ...defaultTheme, ...props.theme }}>
        <HoveringTool>
          <HoveringToolbars />
        </HoveringTool>
        <BlockInsert />
        <div
          style={{
            marginLeft: 20
          }}
        >
          <EditorThemeWrapper>
            <Editable
              renderLeaf={renderLeaf}
              renderElement={renderElement}
              onKeyDown={handleKeyDown}
            />
          </EditorThemeWrapper>
        </div>
      </ThemeProvider>
    </Slate>
  );
}
