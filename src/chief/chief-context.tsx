import React, { useState, useRef } from "react";
import { ReactEditor, Editable } from "slate-react";
import { OnPlugin } from "../addon";
import { KeyHandler } from "./key-handler";
import { createEditor } from "./utils/create-editor";
import {
  InjectedRenderLeaf,
  InjectedRenderElement,
  InjectedLabels,
  InjectedDecorator
} from "./chief";
interface ChiefRenderCore {
  injectRenderLeaf: (irl: InjectedRenderLeaf) => void;
  removeRenderLeaf: (irl: InjectedRenderLeaf) => void;
  renderLeafs: Array<InjectedRenderLeaf>;
  injectRenderElement: (irl: InjectedRenderElement<any>) => void;
  removeRenderElement: (irl: InjectedRenderElement<any>) => void;
  renderElements: InjectedRenderElement[];
}

export function useChiefRenderCore() {
  const [renderLeafs, setRenderLeafs] = useState<InjectedRenderLeaf[]>([]);
  const [renderElements, setRenderElements] = useState<InjectedRenderElement[]>(
    []
  );
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

  return {
    renderLeafs,
    injectRenderLeaf,
    removeRenderLeaf,
    renderElements,
    injectRenderElement,
    removeRenderElement
  };
}

export interface ChiefContextValue extends ChiefRenderCore {
  editor: ReactEditor;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
  id: string;
  injectOnKeyHandler: (keyHandler: KeyHandler) => void;
  removeOnKeyHandler: (keyHandler: KeyHandler) => void;
  onKeyDownHandlers: KeyHandler[];
  injectPlugin: (plugin: OnPlugin) => void;
  removePlugin: (plugin: OnPlugin) => void;
  OnPlugins: OnPlugin[];
  labels: InjectedLabels;
  injectLabels: (labels: InjectedLabels) => void;
  decorations: InjectedDecorator[];
  injectDecoration: (decoration: InjectedDecorator) => void;
  removeDecoration: (decoration: InjectedDecorator) => void;
}
export const ChiefContext = React.createContext<ChiefContextValue | null>(null);
let count = 1;
export function useProvideChiefContext(props: {
  readOnly?: boolean;
  id?: string;
}) {
  const [injectedPlugins, setInjectedPlugins] = useState<OnPlugin[]>([]);
  const [injectedLabels, setInjectedLabels] = useState<InjectedLabels>({});
  const [onKeyHandlers, setOnKeyHandlers] = useState<KeyHandler[]>([]);
  const [decorations, setDecorations] = useState<InjectedDecorator[]>([]);
  const editor = createEditor(injectedPlugins);
  const [readOnly, setReadOnly] = useState(Boolean(props.readOnly));
  const { current: id } = useRef(props.id || `chiefeditor${count++}`);

  function injectPlugin(plugin: OnPlugin) {
    setInjectedPlugins(plugins => [...plugins, plugin]);
  }

  function removePlugin(plugin: OnPlugin) {
    setInjectedPlugins(it => {
      const toSlicer = [...it];
      toSlicer.splice(toSlicer.indexOf(plugin), 1);
      return toSlicer;
    });
  }

  function injectOnKeyHandler(keyHandler: KeyHandler) {
    setOnKeyHandlers(it =>
      [...it, keyHandler].sort((a, b) =>
        a.priority === b.priority ? 0 : a.priority === "low" ? 1 : -1
      )
    );
  }

  function removeOnKeyHandler(keyHandler: KeyHandler) {
    setOnKeyHandlers(it => {
      const toSlicer = [...it];
      toSlicer.splice(it.indexOf(keyHandler), 1);
      return toSlicer;
    });
  }

  function injectDecoration(decorator: InjectedDecorator) {
    setDecorations(it =>
      [...it, decorator].sort((a, b) =>
        a.priority === b.priority ? 0 : a.priority === "low" ? 1 : -1
      )
    );
  }

  function removeDecoration(decorator: InjectedDecorator) {
    setDecorations(it => {
      const toSlicer = [...it];
      toSlicer.splice(it.indexOf(decorator), 1);
      return toSlicer;
    });
  }

  function injectLabels(labels: InjectedLabels) {
    setInjectedLabels(it => ({ ...it, ...labels }));
  }

  const value: ChiefContextValue = {
    ...useChiefRenderCore(),
    editor,
    readOnly,
    setReadOnly,
    id,
    injectOnKeyHandler,
    removeOnKeyHandler,
    onKeyDownHandlers: onKeyHandlers,
    injectPlugin,
    removePlugin,
    OnPlugins: injectedPlugins,
    labels: injectedLabels,
    injectLabels,
    decorations,
    injectDecoration,
    removeDecoration
  };

  return value;
}
