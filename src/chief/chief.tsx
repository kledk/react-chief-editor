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
import { Addon } from "../addon";

export type InjectedRenderLeaf = {
  renderLeaf: (
    props: RenderLeafProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
};

export type InjectedRenderElement = {
  typeMatch: RegExp;
  renderElement: (
    props: RenderElementProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
};

interface ChiefContextValue {
  addons: Addon[];
  value: Node[];
  onChange: (value: Node[]) => void;
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
}

const ChiefContext = React.createContext<ChiefContextValue | null>(null);

let count = 1;
function useProvideChiefContext(props: React.ComponentProps<typeof Chief>) {
  const [addons, setAddons] = useState<Addon[]>(props.addons || []);
  const [renderLeafs, setRenderLeafs] = useState<InjectedRenderLeaf[]>([]);
  const [renderElements, setRenderElements] = useState<InjectedRenderElement[]>(
    []
  );
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

  const value: ChiefContextValue = {
    addons: addons,
    editor,
    value: props.value,
    onChange: props.onChange,
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
    removeRenderElement
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

export function useRenderLeaf(irl: InjectedRenderLeaf, overrides: Addon) {
  const chief = useChief();
  useEffect(() => {
    const _irl = merge({}, irl, overrides?.renderLeaf);
    chief.injectRenderLeaf(_irl);
    return () => chief.removeRenderLeaf(_irl);
  }, []);
}

export function useRenderElement(ire: InjectedRenderElement, overrides: Addon) {
  const chief = useChief();
  useEffect(() => {
    const _ire = merge({}, ire, overrides?.renderElement);
    chief.injectRenderElement(_ire);
    return () => chief.removeRenderElement(_ire);
  }, []);
}

export const Chief = React.memo(function(props: {
  value: Node[];
  onChange: (value: Node[]) => void;
  children: React.ReactNode;
  addons?: Addon[];
  readOnly?: boolean;
  id?: string;
}) {
  const { children } = props;
  const chief = useProvideChiefContext(props);
  return (
    <Slate
      editor={chief.value.editor}
      value={chief.value.value}
      onChange={chief.value.onChange}
    >
      <ChiefContext.Provider value={chief.value}>
        <React.Fragment>{children}</React.Fragment>
      </ChiefContext.Provider>
    </Slate>
  );
});

const createEditor = (addons: Addon[]): ReactEditor => {
  const editor = useMemo(() => withReact(withHistory(createSlateEditor())), []);
  return useMemo(() => {
    let _editor: ReactEditor = editor;
    addons.forEach(addon => {
      if (addon.withPlugin) {
        _editor = addon.withPlugin(_editor);
      }
    });
    return _editor;
  }, [addons]);
};
