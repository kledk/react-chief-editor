import React, { useState, useRef, useContext, useMemo, useEffect } from "react";
import {
  RenderLeafProps,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact
} from "slate-react";
import { createEditor as createSlateEditor, Node } from "slate";
import { withHistory } from "slate-history";
import merge from "lodash/merge";
import clone from "lodash/clone";
import { Addon } from "../addon";

export type InjectedRenderLeaf = {
  renderLeaf: (
    props: RenderLeafProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
};

export type InjectedRenderElement = {
  typeMatch: RegExp;
  renderElement:
    | JSX.Element
    | ((
        props: RenderElementProps,
        editor: ReactEditor
      ) => JSX.Element | undefined);
};

interface ChiefContextValue {
  addons: Addon[];
  editor: ReactEditor;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
  id: string;
  injectAddon: (addon: Addon) => void;
  removeAddon: (addon: Addon) => void;
  injectRenderLeaf: (irl: InjectedRenderLeaf) => void;
  removeRenderLeaf: (irl: InjectedRenderLeaf) => void;
  renderLeafs: Array<InjectedRenderLeaf>;
  injectRenderElement: (irl: InjectedRenderElement) => void;
  removeRenderElement: (irl: InjectedRenderElement) => void;
  renderElements: InjectedRenderElement[];
  injectOnKeyHandler: (keyHandler: KeyHandler) => void;
  removeOnKeyHandler: (keyHandler: KeyHandler) => void;
  onKeyHandlers: KeyHandler[];
}

const ChiefContext = React.createContext<ChiefContextValue | null>(null);

let count = 1;
function useProvideChiefContext(props: {
  addons?: Addon[];
  readOnly?: boolean;
  id?: string;
}) {
  const [addons, setAddons] = useState<Addon[]>(props.addons || []);
  const [renderLeafs, setRenderLeafs] = useState<InjectedRenderLeaf[]>([]);
  const [renderElements, setRenderElements] = useState<InjectedRenderElement[]>(
    []
  );
  const [onKeyHandlers, setOnKeyHandlers] = useState<KeyHandler[]>([]);
  const editor = createEditor(addons);
  const [readOnly, setReadOnly] = useState(Boolean(props.readOnly));
  const { current: id } = useRef(props.id || `chiefeditor${count++}`);

  function injectAddon(addon: Addon) {
    setAddons(addons => [...addons, addon]);
  }

  function removeAddon(addon: Addon) {
    setAddons(it => {
      const toSlicer = [...it];
      toSlicer.splice(toSlicer.indexOf(addon), 1);
      return toSlicer;
    });
  }

  function injectRenderLeaf(irl: InjectedRenderLeaf) {
    setRenderLeafs(it => [...it, irl]);
  }

  function removeRenderLeaf(irl: InjectedRenderLeaf) {
    setRenderLeafs(it => {
      const toSlicer = [...it];
      toSlicer.splice(toSlicer.indexOf(irl), 1);
      return toSlicer;
    });
  }

  function injectRenderElement(ire: InjectedRenderElement) {
    setRenderElements(it => [...it, ire]);
  }

  function removeRenderElement(ire: InjectedRenderElement) {
    setRenderElements(it => {
      const toSlicer = [...it];
      toSlicer.splice(it.indexOf(ire), 1);
      return toSlicer;
    });
  }

  function injectOnKeyHandler(keyHandler: KeyHandler) {
    setOnKeyHandlers(it => [...it, keyHandler]);
  }

  function removeOnKeyHandler(keyHandler: KeyHandler) {
    setOnKeyHandlers(it => {
      const toSlicer = [...it];
      toSlicer.splice(it.indexOf(keyHandler), 1);
      return toSlicer;
    });
  }

  const value: ChiefContextValue = {
    addons: addons,
    editor,
    readOnly,
    setReadOnly,
    id,
    injectAddon,
    removeAddon,
    renderLeafs,
    injectRenderLeaf,
    removeRenderLeaf,
    renderElements,
    injectRenderElement,
    removeRenderElement,
    injectOnKeyHandler,
    removeOnKeyHandler,
    onKeyHandlers
  };

  return {
    value
  };
}

export function useChief() {
  const ctx = useContext(ChiefContext);
  if (!ctx) {
    throw new Error(
      'Chief context not found. Wrap your <Chief.Editor/> in a <Chief/> before using "useChief()"'
    );
  }
  return ctx;
}

export function useAddon(name: string) {
  const chief = useChief();
  return chief.addons.find(it => it.name === name);
}

export function useCreateAddon<TAddon extends Addon>(
  addon: TAddon,
  overrides?: TAddon
) {
  const chief = useChief();
  const injectedAddon: TAddon = useMemo(() => ({ ...addon, ...overrides }), []);
  useEffect(() => {
    chief.injectAddon(injectedAddon);
    return () => chief.removeAddon(addon);
  }, []);
  return { addon: injectedAddon };
}

export function useRenderLeaf(
  irl: InjectedRenderLeaf,
  overrides: Addon,
  deps: any[] = []
) {
  const chief = useChief();
  useEffect(() => {
    const _irl = merge({}, irl, overrides?.renderLeaf);
    chief.injectRenderLeaf(_irl);
    return () => chief.removeRenderLeaf(_irl);
  }, deps);
}

export function useRenderElement(
  ire: InjectedRenderElement,
  overrides: Addon,
  deps: any[] = []
) {
  const chief = useChief();
  useEffect(() => {
    const _ire = merge({}, ire, overrides?.renderElement);
    chief.injectRenderElement(_ire);
    return () => chief.removeRenderElement(_ire);
  }, deps);
}

export type KeyHandler = {
  /** Key pattern used to trigger, eg. "mod+b"*/
  pattern?: string;
  /** Handler function for key trigger.*/
  handler: (
    e: KeyboardEvent,
    editor: ReactEditor
  ) => boolean | undefined | void;
};

/**
 * Respond to onKeyDown events in the editor.
 * If you want to receive all onKeyDown events, you can leave out the pattern.
 * For responding to certain key down combos, you can specify a key pattern, eg. "mod+b".
 * @param handler Function to call when a key or combo is pressed
 * @param overrides
 * @param deps
 */
export function useOnKeyDown(
  handler: KeyHandler,
  overrides: Addon,
  deps: any[] = []
) {
  const chief = useChief();
  useEffect(() => {
    const _handler = merge({}, handler, overrides?.onKey);
    chief.injectOnKeyHandler(_handler);
    return () => chief.removeOnKeyHandler(_handler);
  }, deps);
}

export const Chief = React.memo(function(props: {
  value: Node[];
  onChange: (value: Node[]) => void;
  children: React.ReactNode;
  addons?: Addon[];
  readOnly?: boolean;
  id?: string;
}) {
  const { children, onChange, value, readOnly, id, addons } = props;
  const chief = useProvideChiefContext({ readOnly, addons, id });
  return (
    <Slate editor={chief.value.editor} value={value} onChange={onChange}>
      <ChiefContext.Provider value={chief.value}>
        <React.Fragment>{children}</React.Fragment>
      </ChiefContext.Provider>
    </Slate>
  );
});

// Use this to save the originals of the editor functions
let originalEntries = {};
/**
 * Allows for dynamically hook in and out of plugins.
 * Only overriding functions of the Editor is supported.
 * @param editor
 * @param addons
 */
function withChief(editor: ReactEditor, addons: Addon[]) {
  // We basically take control over each funtion in the editor and route them
  // to the appropriate addon that has requested overriding it.
  for (const [prop, value] of Object.entries(editor)) {
    if (typeof value === "function") {
      if (!(prop in originalEntries)) {
        originalEntries[prop] = value;
      }
      editor[prop] = (...args: any[]) => {
        let fn = originalEntries[prop];
        for (const addon of addons) {
          if (addon.onPlugin && prop in addon.onPlugin) {
            fn = addon.onPlugin && addon.onPlugin[prop](fn, editor);
          }
        }
        return fn(...args);
      };
    }
  }

  return editor;
}

const createEditor = (addons: Addon[]): ReactEditor => {
  const editor = useMemo(() => withReact(withHistory(createSlateEditor())), []);
  return useMemo(() => {
    let _editor = withChief(editor, addons);
    console.log(_editor);
    return _editor;
  }, [addons]);
};
