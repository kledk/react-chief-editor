import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback
} from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range, Node, Transforms, RangeRef } from "slate";
import { Popper } from "react-popper";
import { VirtualElement } from "@popperjs/core";
import { useOnClickOutside, getNodeFromSelection } from "./utils";

type HoverToolContext = {
  activeNode?: Node;
  enabled: boolean;
  selection: RangeRef | null;
  saveSelection: (selection: Range | null) => () => void;
  perform: (fn: (selection: Range) => void) => void;
};

const hoverToolContext = React.createContext<HoverToolContext | undefined>(
  undefined
);

function useProvideContext() {
  const editor = useSlate();
  const { selection } = editor;
  const [ctx, setCtx] = useState<HoverToolContext>({
    enabled: false,
    saveSelection: () => () => null,
    perform: () => () => null,
    selection: null
  });
  const [savedSelection, setSaveSelection] = useState<RangeRef | null>(null);
  const isEditorFocused = ReactEditor.isFocused(editor);
  const isCollapsed = selection && Range.isCollapsed(selection);
  const isEmpty = selection && Editor.string(editor, selection) === "";
  const currentNode = getNodeFromSelection(editor, selection);
  const isVoid = Editor.isVoid(editor, currentNode);

  // console.log({
  //   isEditorFocused,
  //   selection,
  //   isCollapsed,
  //   isEmpty,
  //   isVoid,
  //   ...ctx
  // });

  const setEnabled = useCallback((enabled: boolean) => {
    setCtx(ctx => ({
      ...ctx,
      enabled
    }));
  }, []);

  useEffect(() => {
    if (ctx.enabled) {
      if (!savedSelection?.current && isCollapsed && !isVoid) {
        console.log("close")
        setEnabled(false);
      }
    } else {
      if (isEditorFocused) {
        if (isCollapsed && isVoid) {
          setEnabled(true);
        } else if (!isCollapsed && !isEmpty) {
          setEnabled(true);
        }
      }
    }
  }, [isEditorFocused, isCollapsed, isEmpty, isVoid]);

  const editorRef = useRef(editor);
  editorRef.current = editor;

  const saveSelection = useCallback((selection: Range | null) => {
    if (selection) {
      const sRef = Editor.rangeRef(editor, selection);
      setSaveSelection(sRef);
      setCtx(ctx => ({ ...ctx, selection: sRef }));
      return () => {
        if (sRef.current) {
          Transforms.select(editorRef.current, sRef.current);
          ReactEditor.focus(editorRef.current);
          setSaveSelection(null);
          sRef.current = null;
        }
      };
    }
    return () => null;
  }, []);

  useEffect(() => setCtx(ctx => ({ ...ctx, saveSelection })), []);

  const perform = useCallback(
    (fn: (selection: Range) => void) => {
      if (savedSelection && savedSelection.current) {
        Transforms.select(editorRef.current, savedSelection.current);
        fn(savedSelection.current);
      }
    },
    [savedSelection]
  );
  useEffect(() => setCtx(ctx => ({ ...ctx, perform })), [perform]);

  return { ctx, setEnabled };
}

export function useHoverTool() {
  const ctx = useContext(hoverToolContext);
  if (ctx === undefined) {
    throw new Error("useHoverTool must be within a <HoverToolProvider/>");
  }
  return ctx;
}

export function HoverToolProvider(props: {
  children?: React.ReactNode;
  hoverTool: React.ReactNode;
}) {
  const { ctx, setEnabled } = useProvideContext();
  return (
    <hoverToolContext.Provider value={ctx}>
      <HoveringTool
        onChangeEnabled={enabled => setEnabled(enabled)}
        enabled={ctx.enabled}
      >
        {props.hoverTool}
      </HoveringTool>
      {props.children}
    </hoverToolContext.Provider>
  );
}

export const HoveringTool = (
  props: {
    children?: React.ReactNode;
    enabled: boolean;
    onChangeEnabled: (enabled: boolean) => void;
  } & React.HTMLProps<HTMLDivElement>
) => {
  const { children, enabled, onChangeEnabled, ...otherProps } = props;
  const editor = useSlate();
  const { selection } = editor;

  const [deltaOffset, setDeltaOffset] = useState(-1);

  useEffect(() => {
    const deltaoffset = selection
      ? selection.focus.offset - selection.anchor.offset
      : -1;
    setDeltaOffset(deltaoffset);
  }, [selection]);

  const toolRef = useRef(null);
  const [_v, _setV] = useState<VirtualElement>({
    getBoundingClientRect: () => ({
      top: -1000,
      left: -1000,
      bottom: 0,
      right: 0,
      width: 1,
      height: 1
    })
  });

  useOnClickOutside(toolRef, e => {
    const currentNode = getNodeFromSelection(editor, selection);
    if (currentNode) {
      const domNode = ReactEditor.toDOMNode(editor, currentNode);
      if (e.target && domNode.contains(e.target as globalThis.Node)) {
        return;
      }
    }
    onChangeEnabled(false);
  });

  useEffect(() => {
    if (enabled) {
      const currentNode = getNodeFromSelection(editor, selection);
      const isVoid = Editor.isVoid(editor, currentNode);
      if (isVoid && currentNode) {
        const domNode = ReactEditor.toDOMNode(editor, currentNode);
        _setV({
          getBoundingClientRect: () => domNode.getBoundingClientRect()
        });
      } else {
        const domSelection = window.getSelection();
        if (domSelection && domSelection.rangeCount > 0) {
          const domRange = domSelection.getRangeAt(0);
          if (domRange && deltaOffset !== -1) {
            _setV({
              getBoundingClientRect: () => domRange.getBoundingClientRect()
            });
          }
        }
      }
    }
  }, [enabled, deltaOffset, selection]);

  if (!enabled || !children) {
    return null;
  }

  return (
    <Popper
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 10]
          }
        }
      ]}
      placement="top-end"
      referenceElement={_v}
    >
      {({ ref, style, placement, arrowProps }) => (
        <div
          ref={ref}
          style={{ ...style, zIndex: 10 }}
          data-placement={placement}
        >
          <div ref={toolRef} {...otherProps}>
            {children}
          </div>
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
  );
};
