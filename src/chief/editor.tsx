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
import styled from "styled-components";
import { StyledToolbarBtn } from "../ui/styled-toolbar-btn";
import { StyledToolBox } from "../StyledToolBox";
import { ToolDivider } from "../ToolDivider";
import { ToolsWrapper } from "../ToolsWrapper";
import { isNodeActive, useHover } from "../utils";
import { OverrideTheme } from "../override-theme";
import {
  InjectedRenderElement,
  InjectedRenderLeaf,
  ChiefRenderElementProps,
  ChiefElement
} from "./chief";
import { useChief } from "./hooks/use-chief";
import { KeyHandler } from "./key-handler";
import isHotkey from "is-hotkey";
import { Control } from "../control";
import { matchesType } from "./utils/matches-type";

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
  ${props => OverrideTheme("Editor", props)}
`;

export function HoverToolControls(props: { controls: Control[] }) {
  const { controls } = props;
  const editor = useSlate();
  const { selection } = editor;
  if (selection) {
    const eligableControls = controls.filter(control => {
      const [match] = SlateEditor.nodes(editor, {
        match: n => {
          if (control.typeMatch && typeof n.type === "string") {
            if (matchesType(n as ChiefElement, control.typeMatch)) {
              return true;
            }
          } else if (
            !control.typeMatch &&
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
    if (eligableControls.length > 0) {
      const groupedControls = groupBy(eligableControls, "category");
      return (
        <StyledToolBox>
          <ToolsWrapper>
            {Object.entries(groupedControls).map(([, groupedControls]) => (
              <React.Fragment>
                {groupedControls.map(control => {
                  if (control.Component) {
                    return <control.Component />;
                  }
                  const renderControl = control.render;
                  return typeof renderControl === "function"
                    ? renderControl(editor)
                    : renderControl;
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

export function BlockInsertControls(props: { controls: Control[] }) {
  const editor = useSlate();
  const controls = props.controls;
  if (controls.length > 0) {
    const grouped = groupBy(controls, "category");
    return (
      <StyledToolBox>
        <ToolsWrapper>
          {Object.entries(grouped).map(([k, groupedControls]) => (
            <React.Fragment>
              {groupedControls.map((control, i) => {
                if (control.Component) {
                  return <control.Component key={i} />;
                }
                const renderButton = control.render;
                return typeof renderButton === "function"
                  ? renderButton(editor)
                  : renderButton;
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
    if (
      renderElement.typeMatch === undefined ||
      matchesType(props.element, renderElement.typeMatch)
    ) {
      if (renderElement.Component) {
        element = <renderElement.Component {...props} />;
      } else if (renderElement.renderElement) {
        element =
          typeof renderElement.renderElement === "function"
            ? renderElement.renderElement(props, editor)
            : React.cloneElement(renderElement.renderElement, props) || element;
      }
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
  clickLick: []
) => {
  // addons.forEach(addon => {
  //   if (addon.onClick) {
  //     addon.onClick(event, editor);
  //   }
  // });
};

// TODO
const handleDecorate = (
  entry: NodeEntry,
  editor: ReactEditor,
  decorateList: Array<() => []>
) => {
  let ranges: Range[] = [];
  // for (let decorate of decorateList) {
  //   const result = decorate(entry, editor);
  //   if (result) {
  //     return (ranges = ranges.concat(result));
  //   }
  // }
  return ranges;
};

export const Editor = React.memo(
  (
    props: {
      children?: React.ReactNode;
    } & React.ComponentProps<typeof Editable>
  ) => {
    const {
      editor,
      readOnly,
      id,
      renderLeafs,
      renderElements,
      onKeyHandlers
    } = useChief();
    const { children, ...otherProps } = props;

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
      (entry: NodeEntry) => handleDecorate(entry, editor, []),
      []
    );

    const keyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        return handleKeyDown(event, editor, onKeyHandlers);
      },
      [onKeyHandlers]
    );

    // TODO
    const keyUp = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyUp(event, editor);
    }, []);

    const click = useCallback(
      (event: React.MouseEvent<HTMLElement>) => handleClick(event, editor, []),
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

    // TODO
    const onDOMBeforeInput = useCallback(e => {}, []);

    return (
      <React.Fragment>
        <EditorThemeWrapper>
          {children}
          <Editable
            onDOMBeforeInput={onDOMBeforeInput}
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
      </React.Fragment>
    );
  }
);
