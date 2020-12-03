import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback
} from "react";
import { ReactEditor, useSlate, useEditor } from "slate-react";
import { Editor, Range, Node, Transforms, RangeRef } from "slate";
import { Popper } from "react-popper";
import { VirtualElement } from "@popperjs/core";
import { useOnClickOutside, getNodeFromSelection } from "../../utils";
import { useDecoration } from "../../chief/hooks/use-decoration";
import { useRenderLeaf } from "../../chief";
import { useChief } from "../../chief/hooks/use-chief";
import { Control } from "../../control";
import { HoverToolControls } from "./hover-tool-controls";

const ControlsContext = React.createContext<ReturnType<
  typeof useProvideControlContext
> | null>(null);

export function useProvideControlContext() {
  const [controls, setControls] = useState<Control[]>([]);
  function injectControl(control: Control) {
    setControls(controls => [...controls, control]);
  }

  function removeControl(control: Control) {
    setControls(it => {
      const toSlicer = [...it];
      toSlicer.splice(toSlicer.indexOf(control), 1);
      return toSlicer;
    });
  }
  return { controls, injectControl, removeControl };
}

export function useControlsProvider() {
  const value = useProvideControlContext();
  return [ControlsContext, value] as const;
}

export function useProvidedControls() {
  const ctx = useContext(ControlsContext);
  if (!ctx) {
    throw new Error("No ControlsContext.Provider in scope.");
  }
  return ctx;
}

export function useControl<T extends React.FunctionComponent<any>>(
  control: Control<T>
) {
  const { injectControl, removeControl } = useProvidedControls();
  useEffect(() => {
    injectControl(control);
    return () => removeControl(control);
  }, []);
  return null;
}

export const deselect = Transforms.deselect;
Transforms.deselect = (...args) => {
  // We disable the default deselect.
};

type HoverToolContext = ReturnType<typeof useProvideContext>["ctx"];

const hoverToolContext = React.createContext<HoverToolContext | undefined>(
  undefined
);

function useHighlightSelection(
  selection: Range | null | undefined,
  style: React.CSSProperties
) {
  useRenderLeaf(
    {
      renderLeaf: props => {
        return (
          <span
            style={props.leaf.highlightSelection ? style : undefined}
            {...props.attributes}
          >
            {props.children}
          </span>
        );
      }
    },
    [selection]
  );

  useDecoration(
    {
      decorator: ([node]) => {
        const ranges: Range[] = [];
        if (selection && Node.has(node, selection.anchor.path)) {
          ranges.push({ ...selection, highlightSelection: true });
        }
        return ranges;
      }
    },
    [selection]
  );
}

function useProvideContext() {
  const editor = useSlate();
  const { selection } = editor;

  const [savedSelection, setSaveSelection] = useState<RangeRef | null>(null);
  const isEditorFocused = ReactEditor.isFocused(editor);
  const isCollapsed = selection && Range.isCollapsed(selection);
  const isEmpty = selection && Editor.string(editor, selection) === "";
  const currentNode = getNodeFromSelection(editor, selection);
  const isVoid = Editor.isVoid(editor, currentNode);
  const isReadOnly = useChief().readOnly;
  useHighlightSelection(savedSelection?.current, {
    backgroundColor: "#969696"
  });

  // console.log({
  //   isEditorFocused,
  //   selection,
  //   isCollapsed,
  //   isEmpty,
  //   isVoid,
  //   ...ctx
  // });

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isReadOnly) {
      setEnabled(false);
    } else if (ctx.enabled) {
      if (!savedSelection?.current && isCollapsed && !isVoid) {
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
      return () => {
        if (sRef.current) {
          setTimeout(() => {
            ReactEditor.focus(editorRef.current);
            Transforms.select(editorRef.current, sRef.current!);
            setSaveSelection(null);
            sRef.unref();
          }, 0);
        }
      };
    }
    return () => null;
  }, []);

  const perform = useCallback(
    (fn: (selection: Range) => void) => {
      if (savedSelection && savedSelection.current) {
        Transforms.select(editorRef.current, savedSelection.current);
        fn(savedSelection.current);
      }
    },
    [savedSelection]
  );

  const ctx = {
    enabled,
    saveSelection,
    perform
  };

  return { ctx, setEnabled };
}

export function useHoverTool() {
  const ctx = useContext(hoverToolContext);
  if (ctx === undefined) {
    throw new Error("useHoverTool must be within a <HoverToolProvider/>");
  }
  return ctx;
}

export function HoverTools(props: { children?: React.ReactNode }) {
  const { ctx, setEnabled } = useProvideContext();
  const [ControlsContext, controls] = useControlsProvider();
  return (
    <hoverToolContext.Provider value={ctx}>
      <ControlsContext.Provider value={controls}>
        <HoveringTool
          onChangeEnabled={enabled => setEnabled(enabled)}
          enabled={ctx.enabled}
        >
          <HoverToolControls />
        </HoveringTool>
        {props.children}
      </ControlsContext.Provider>
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
  const currentNode = getNodeFromSelection(editor, selection);

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
      const isVoid = Editor.isVoid(editor, currentNode);
      if (isVoid && currentNode) {
        try {
          const domNode = ReactEditor.toDOMNode(editor, currentNode);
          _setV({
            getBoundingClientRect: () => domNode.getBoundingClientRect()
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const domRange = domSelection.getRangeAt(0);
            if (domRange && deltaOffset !== -1) {
              _setV({
                getBoundingClientRect: () => domRange.getBoundingClientRect()
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [enabled, deltaOffset, selection, currentNode]);

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
