import groupBy from "lodash/groupBy";
import merge from "lodash/merge";
import orderBy from "lodash/orderBy";
import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import {
  createEditor as createSlateEditor,
  Editor as SlateEditor,
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
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { isDefined } from "ts-is-present";
import { Addon } from "./addon";
import { BlockInsert } from "./BlockInsert";
import { HoverToolProvider } from "./HoveringTool";
import { PlaceholderHint } from "./placeholder-hint";
import { StyledToolbarBtn } from "./StyledToolbarBtn";
import { StyledToolBox } from "./StyledToolBox";
import { ToolDivider } from "./ToolDivider";
import { ToolsWrapper } from "./ToolsWrapper";
import { isNodeActive } from "./utils";
import { OverrideTheme } from "./override-theme";
import { AeditorTheme } from "./AeditorTheme";
import { defaultTheme } from "./defaultTheme";
import { BoldAddon } from "./addons/bold";

export const deselect = Transforms.deselect;
Transforms.deselect = () => {
  // We disable the default deselect.
};

export const RichEditor = {
  ...ReactEditor,
  insertBlock(editor: SlateEditor, blockType: string) {
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
  font-size: 14px;
  ${props => props.theme.overrides.editor}
  ${props => OverrideTheme("Editor", props)}
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

function HoveringToolbars(props: { addons: Addon[] }) {
  const { addons } = props;
  const editor = useSlate();
  // const { selection } = useHoverTool();
  const { selection } = editor;
  if (selection) {
    const addonsWithBtns = addons
      // .map(it => it.hoverMenu)
      .filter(addon => isDefined(addon.hoverMenu))
      .filter(addon => {
        const [match] = SlateEditor.nodes(editor, {
          match: n => {
            if (addon.hoverMenu?.typeMatch && typeof n.type === "string") {
              if (n.type.match(addon.hoverMenu.typeMatch)) {
                return true;
              }
            } else if (
              !addon.hoverMenu?.typeMatch &&
              !SlateEditor.isVoid(editor, n) &&
              typeof n.type === "string"
            ) {
              return true;
            }
            return false;
          }
        });
        return Boolean(match);
      });
    if (addonsWithBtns.length > 0) {
      const ordered = orderBy(addonsWithBtns, "hoverMenu.order");
      const grouped = groupBy(ordered, "hoverMenu.category");
      return (
        <StyledToolBox>
          <ToolsWrapper>
            {Object.entries(grouped).map(([, orderedAddons]) => (
              <React.Fragment>
                {orderedAddons.map((addon, i) => {
                  if (addon.hoverMenu) {
                    const renderButton = addon.hoverMenu.renderButton;
                    return typeof renderButton === "function"
                      ? renderButton(editor, addon)
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
        isEmpty={SlateEditor.isEmpty(editor, props.element)}
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
      element = addon.element.renderElement(props, editor, addon) || element;
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
  const [node, path] = SlateEditor.node(editor, selection as Location);
  if (!path.length) {
    return;
  }
  const [parent] = SlateEditor.parent(editor, path);
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
  const editor = useMemo(() => createSlateEditor(), []);
  return useMemo(() => {
    let _editor: ReactEditor = withHistory(withReact(editor));
    addons.forEach(addon => {
      if (addon.withPlugin) {
        _editor = addon.withPlugin(_editor);
      }
    });
    return _editor;
  }, [addons]);
};

interface ChiefContextValue {
  addons: Addon[];
  editor: ReactEditor;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
  id: string;
  injectAddon: (addon: Addon) => void;
}

const ChiefContext = React.createContext<ChiefContextValue | null>(null);

let count = 1;
function useProvideChiefContext(props: React.ComponentProps<typeof Chief>) {
  const [addons, setAddons] = useState<Addon[]>(props.addons);
  const editor = createEditor(addons);
  console.log(editor);
  const [readOnly, setReadOnly] = useState(Boolean(props.readOnly));
  const { current: id } = useRef(props.id || `chiefeditor${count++}`);
  function injectAddon(addon: Addon) {
    setAddons(addons => [...addons, addon]);
  }
  const value: ChiefContextValue = {
    addons: addons,
    editor,
    readOnly,
    setReadOnly,
    id,
    injectAddon
  };

  return {
    value
  };
}

function useChief() {
  const ctx = useContext(ChiefContext);
  if (!ctx) {
    throw new Error(
      "Chief not found. Wrap your <Chief.Editor/> in a <Chief/>."
    );
  }
  return ctx;
}

function useAddon(name: string) {
  const chief = useChief();
  return chief.addons.find(it => it.name === name);
}

export const Chief = React.memo(function(props: {
  children: React.ReactNode;
  addons: Addon[];
  readOnly?: boolean;
  id: string;
}) {
  const { children } = props;
  const { value } = useProvideChiefContext(props);
  return (
    <ChiefContext.Provider value={value}>
      <React.Fragment>{children}</React.Fragment>
    </ChiefContext.Provider>
  );
});

export function useCreateAddon(addon: Addon, overrides?: Addon) {
  const { injectAddon } = useChief();
  function AddonComponent() {
    return null;
  }
  useEffect(() => injectAddon({ ...addon, ...overrides }), []);

  return AddonComponent;
}

export const Editor = React.memo(
  (
    props: {
      value: Node[];
      onChange: (value: Node[]) => void;
      theme?: AeditorTheme & { [key: string]: any };
    } & React.ComponentProps<typeof Editable>
  ) => {
    const { addons, editor, readOnly, id } = useChief();
    const { value, onChange, theme, ...otherProps } = props;

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

    const keyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        return handleKeyDown(event, editor, addons);
      },
      []
    );

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
                    readOnly={readOnly}
                    id={`${id}`}
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
);
