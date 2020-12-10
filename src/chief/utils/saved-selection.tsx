import React, {
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState
} from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range, Transforms, RangeRef } from "slate";

type Context = ReturnType<typeof useProvideContext>;

const savedSelectionContext = React.createContext<Context | undefined>(
  undefined
);

export function useSaveSelection() {
  const context = useContext(savedSelectionContext);
  if (!context) {
    throw new Error("No SavedSelectionProvider.");
  }
  return context;
}

export function SavedSelectionProvider(props: { children: ReactNode }) {
  const value = useProvideContext();
  return (
    <savedSelectionContext.Provider value={value}>
      {props.children}
    </savedSelectionContext.Provider>
  );
}

function useProvideContext() {
  const editor = useSlate();
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const [savedSelection, setSaveSelection] = useState<RangeRef | null>(null);
  const saveSelection = useCallback((selection: Range | null) => {
    if (selection !== null) {
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
  return { saveSelection, savedSelection };
}
