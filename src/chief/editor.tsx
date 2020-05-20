import React, { useCallback } from "react";
import groupBy from "lodash/groupBy";
import merge from "lodash/merge";
import orderBy from "lodash/orderBy";
import {
  Editor as SlateEditor,
  Location,
  NodeEntry,
  Range,
  Transforms
} from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  useSlate
} from "slate-react";
import styled, { ThemeProvider } from "styled-components";
import { isDefined } from "ts-is-present";
import { Addon } from "../addon";
import { BlockInsert } from "../BlockInsert";
import { HoverToolProvider } from "../HoveringTool";
import { StyledToolbarBtn } from "../StyledToolbarBtn";
import { StyledToolBox } from "../StyledToolBox";
import { ToolDivider } from "../ToolDivider";
import { ToolsWrapper } from "../ToolsWrapper";
import { isNodeActive } from "../utils";
import { OverrideTheme } from "../override-theme";
import { ChiefEditorTheme } from "../chief-editor-theme";
import { defaultTheme } from "../defaultTheme";
import {
  InjectedRenderElement,
  InjectedRenderLeaf,
  useChief,
  KeyHandler,
  ChiefRenderElementProps
} from "./chief";
import isHotkey from "is-hotkey";

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
                {orderedAddons.map(addon => {
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
              {buttons.map(it => {
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

const handleRenderElement = (
  props: ChiefRenderElementProps,
  editor: ReactEditor,
  renderElements: InjectedRenderElement[]
) => {
  let element: JSX.Element | undefined;
  for (let renderElement of renderElements) {
    const elementType = props.element.type;
    if (
      renderElement.typeMatch === undefined ||
      (Array.isArray(renderElement.typeMatch) &&
        renderElement.typeMatch.includes(elementType)) ||
      (typeof renderElement.typeMatch === "string" &&
        renderElement.typeMatch === elementType) ||
      (renderElement.typeMatch instanceof RegExp &&
        elementType.match(renderElement.typeMatch))
    ) {
      element =
        typeof renderElement.renderElement === "function"
          ? renderElement.renderElement(props, editor)
          : React.cloneElement(renderElement.renderElement, props) || element;
    }
  }

  return (element = element || <React.Fragment>{null}</React.Fragment>);
};

function handleRenderLeaf(
  props: RenderLeafProps,
  editor: ReactEditor,
  renderLeafs: InjectedRenderLeaf[]
) {
  let copy = { ...props };
  for (const renderLeaf of renderLeafs) {
    const leaf = renderLeaf.renderLeaf(copy, editor);
    if (leaf) {
      copy = { ...copy, children: leaf };
    }
  }
  return <span {...copy.attributes}>{copy.children}</span>;
}

const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: ReactEditor,
  onKeyHandlers: KeyHandler[]
) => {
  for (let handler of onKeyHandlers) {
    if (handler.pattern) {
      if (
        isHotkey(handler.pattern, event.nativeEvent) &&
        handler.handler(event.nativeEvent, editor)
      ) {
        return;
      }
    } else {
      if (handler.handler(event.nativeEvent, editor)) {
        return;
      }
    }
  }
};

const handleKeyUp = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: ReactEditor
) => {
  const { selection } = editor;
  if (!selection) {
    return;
  }
  const [, path] = SlateEditor.node(editor, selection as Location);
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

export const Editor = React.memo(
  (
    props: {
      theme?: ChiefEditorTheme & { [key: string]: any };
    } & React.ComponentProps<typeof Editable>
  ) => {
    const {
      addons,
      editor,
      readOnly,
      id,
      renderLeafs,
      renderElements,
      onKeyHandlers
    } = useChief();
    const { theme, ...otherProps } = props;

    const renderElement = useCallback(
      (props: RenderElementProps) => {
        return handleRenderElement(
          props as ChiefRenderElementProps,
          editor,
          renderElements
        );
      },
      [renderElements]
    );

    const renderLeaf = useCallback(
      (props: RenderLeafProps) => {
        return handleRenderLeaf(props, editor, renderLeafs);
      },
      [renderLeafs]
    );

    const decorate = useCallback(
      (entry: NodeEntry) => handleDecorate(entry, editor, addons),
      [addons]
    );

    const keyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        return handleKeyDown(event, editor, onKeyHandlers);
      },
      [onKeyHandlers]
    );

    const keyUp = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyUp(event, editor);
    }, []);

    const click = useCallback(
      (event: React.MouseEvent<HTMLElement>) =>
        handleClick(event, editor, addons),
      [addons]
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
    );
  }
);