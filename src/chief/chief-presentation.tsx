import React, {
  useContext,
  ReactNode,
  useCallback,
  createContext
} from "react";
import { RenderElementProps, RenderLeafProps, Slate } from "slate-react";
import { Node } from "slate";
import { useChief } from "./hooks/use-chief";
import { handleRenderElement } from "./handlers/handleRenderElement";
import {
  ChiefRenderElementProps,
  InjectedRenderLeaf,
  InjectedRenderElement
} from "./chief";
import { handleRenderLeaf } from "./handlers/handleRenderLeaf";
import { useChiefRenderCore, ChiefContextValue } from "./chief-context";

interface SlatePresentationContextValue {
  renderElement: (props: ChiefRenderElementProps) => ReactNode;
  renderLeaf: (props: RenderLeafProps) => ReactNode;
}

const SlatePresentationContext = React.createContext<SlatePresentationContextValue | null>(
  null
);

function useSlatePresentation() {
  const ctx = React.useContext(SlatePresentationContext);
  if (!ctx) {
    throw new Error("No SlatePresentationContext");
  }
  return ctx;
}

function isText(value: any) {
  // TODO: maybe use 'is-plain-object' instead of instanceof Object
  return value instanceof Object && typeof value.text === "string";
}
function isElement(value: any) {
  // TODO: maybe use 'is-plain-object' instead of instanceof Object
  return value instanceof Object && Array.isArray(value.children);
}

function Element({ element = { children: [] } }: any) {
  const { renderElement } = useSlatePresentation();

  return (
    <React.Fragment>
      {/* @ts-ignore */}
      {renderElement({
        children: <Children children={element.children} />,
        element
      })}
    </React.Fragment>
  );
}

function Leaf({ leaf = { text: "" } }: any) {
  const { renderLeaf } = useSlatePresentation();

  return (
    <React.Fragment>
      {renderLeaf({
        // @ts-ignore
        attributes: {},
        children: <span>{leaf.text}</span>,
        leaf,
        text: leaf.text
      })}
    </React.Fragment>
  );
}

function Children({ children = [] }: { children: Node[] }) {
  return (
    <React.Fragment>
      {children.map((child, i) => {
        if (isElement(child)) {
          return <Element key={i} element={child} />;
        } else {
          return <Leaf key={i} leaf={child} />;
        }
      })}
    </React.Fragment>
  );
}

interface RenderAddon {
  Addon: React.FunctionComponent | React.Component;
  Render: {
    renderLeaf?: InjectedRenderLeaf;
    renderElement?: InjectedRenderElement;
  };
}

export function ChiefPresentation({
  value = [],
  addons: [],
  renderElement = (props: RenderElementProps) => <DefaultElement {...props} />,
  renderLeaf = (props: RenderLeafProps) => <DefaultLeaf {...props} />
}: {
  value: Node[];
  addons: RenderAddon[];
  renderElement?: any;
  renderLeaf?: any;
}) {
  const { renderLeafs, renderElements } = useChiefRenderCore();
  const _renderElement = useCallback(
    (props: ChiefRenderElementProps) => {
      return handleRenderElement(props, renderElements);
    },
    [renderLeafs]
  );
  const _renderLeaf = useCallback(
    (props: RenderLeafProps) => {
      return handleRenderLeaf(props, renderLeafs);
    },
    [renderLeafs]
  );
  return (
    <SlatePresentationContext.Provider
      value={{ renderElement: _renderElement, renderLeaf: _renderLeaf }}
    >
      <Children children={value} />
    </SlatePresentationContext.Provider>
  );
}

function DefaultElement({ children }: RenderElementProps) {
  return <div>{children}</div>;
}
function DefaultLeaf({ children }: RenderLeafProps) {
  return <span>{children}</span>;
}
