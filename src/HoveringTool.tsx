import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback
} from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range, Node, Transforms } from "slate";
import { Popper } from "react-popper";
import { VirtualElement } from "@popperjs/core";
import { useOnClickOutside } from "./utils";

type HoverToolContext = {
  activeNode?: Node;
  selection: Range | null;
  enabled: boolean;
  saveSelection: () => () => void;
};

const hoverToolContext = React.createContext<HoverToolContext | undefined>(
  undefined
);

function useProvideContext() {
  const [ctx, setCtx] = useState<HoverToolContext>({
    enabled: false,
    saveSelection: () => () => null,
    selection: null
  });
  const [savedSelection, setSaveSelection] = useState<Range | null>();
  const editor = useSlate();
  const { selection } = editor;
  const isEditorFocused = ReactEditor.isFocused(editor);
  const isCollapsed = selection && Range.isCollapsed(selection);
  const isEmpty = selection && Editor.string(editor, selection) === "";

  const setEnabled = useCallback((enabled: boolean) => {
    setCtx(ctx => ({
      ...ctx,
      enabled
    }));
  }, []);

  useEffect(() => {
    if (ctx.enabled) {
      if (!savedSelection && isCollapsed) {
        setEnabled(false);
      }
    } else {
      if (isEditorFocused && !isCollapsed && !isEmpty) {
        setEnabled(true);
      }
    }
  }, [isEditorFocused, isCollapsed, isEmpty]);

  const editorRef = useRef(editor);

  editorRef.current = editor;

  const saveSelection = useCallback(() => {
    if (selection) {
      const _selection: typeof selection = { ...selection };
      setSaveSelection(_selection);
      return () => {
        Transforms.select(editorRef.current, _selection);
        ReactEditor.focus(editorRef.current);
        setSaveSelection(null);
      };
    }
    return () => null;
  }, [selection]);

  useEffect(() => setCtx(ctx => ({ ...ctx, saveSelection })), [saveSelection]);

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
  children: React.ReactNode;
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
    children: React.ReactNode;
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
  useOnClickOutside(toolRef, () => {
    onChangeEnabled(false);
  });

  useEffect(() => {
    if (enabled) {
      const domSelection = window.getSelection();
      // TODO: handle bugs here
      const domRange = domSelection?.getRangeAt(0);
      if (domRange && deltaOffset !== -1) {
        _setV({
          getBoundingClientRect: () => domRange.getBoundingClientRect()
        });
      }
    }
  }, [enabled, deltaOffset]);

  if (!enabled) {
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
      placement="top"
      referenceElement={_v}
    >
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          <div
            ref={toolRef}
            onMouseDown={e => {
              e.preventDefault();
            }}
            {...otherProps}
          >
            {children}
          </div>
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
  );
};
