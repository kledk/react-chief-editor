import React, { useCallback } from "react";
import merge from "lodash/merge";
import orderBy from "lodash/orderBy";
import { Editor as SlateEditor, NodeEntry, Transforms } from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps
} from "slate-react";
import styled from "styled-components";
import { isNodeActive } from "../utils";
import { OverrideTheme } from "../override-theme";
import { ChiefRenderElementProps } from "./chief";
import { useChief } from "./hooks/use-chief";
import { handleDecorate } from "./handlers/handleDecorate";
import { handleClick } from "./handlers/handleClick";
import { handleKeyUp } from "./handlers/handleKeyUp";
import { handleKeyDown } from "./handlers/handleKeyDown";
import { handleRenderLeaf } from "./handlers/handleRenderLeaf";
import { handleRenderElement } from "./handlers/handleRenderElement";

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
      //TODO
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
    //TODO
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
