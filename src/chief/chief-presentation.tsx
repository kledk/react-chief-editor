import React, { ReactNode, useCallback, useEffect } from "react";
import { RenderLeafProps } from "slate-react";
import { Node } from "slate";
import { handleRenderElement } from "./handlers/handleRenderElement";
import {
  ChiefRenderElementProps,
  InjectedRenderLeaf,
  InjectedRenderElement,
  ChiefElement
} from "./chief";
import { handleRenderLeaf } from "./handlers/handleRenderLeaf";
import { useChiefRenderCore } from "./chief-context";

export type iPresenter<T extends ChiefElement = any> = {
  element?: InjectedRenderElement<T>;
  leaf?: InjectedRenderLeaf;
};

type PresenterElementProps = Omit<ChiefRenderElementProps, "attributes">;
type PresenterLeafProps = Omit<RenderLeafProps, "attributes">;
type PresenterElement = PresenterElementProps["element"];

interface SlatePresentationContextValue {
  renderElement: (props: PresenterElementProps) => ReactNode;
  renderLeaf: (props: PresenterLeafProps) => ReactNode;
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

function isElement(value: any) {
  return value instanceof Object && Array.isArray(value.children);
}

function Element(props: { element: PresenterElement }) {
  const { renderElement } = useSlatePresentation();
  const { element } = props;
  return (
    <React.Fragment>
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
        children: <span>{leaf.text}</span>,
        leaf,
        text: leaf.text
      })}
    </React.Fragment>
  );
}

function Children(props: { children: Node[] }) {
  const { children } = props;
  return (
    <React.Fragment>
      {children.map((child: any, i: number) => {
        if (isElement(child)) {
          return <Element key={i} element={child} />;
        } else {
          return <Leaf key={i} leaf={child} />;
        }
      })}
    </React.Fragment>
  );
}

export function ChiefPresentation({
  value = [],
  presenters = [],
  overrideRenderElement,
  overrideRenderLeaf
}: {
  value: Node[];
  presenters: iPresenter[];
  overrideRenderElement?: (
    props: PresenterElementProps
  ) => JSX.Element | undefined;
  overrideRenderLeaf?: (props: PresenterLeafProps) => JSX.Element | undefined;
}) {
  const {
    renderLeafs,
    renderElements,
    injectRenderElement,
    injectRenderLeaf
  } = useChiefRenderCore();

  useEffect(() => {
    for (const presenter of presenters) {
      if (presenter.element) {
        injectRenderElement(presenter.element);
      }
      if (presenter.leaf) {
        injectRenderLeaf(presenter.leaf);
      }
    }
  }, []);

  return (
    <SlatePresentationContext.Provider
      value={{
        renderElement: useCallback(
          (props: PresenterElementProps) => {
            const overridedElement =
              overrideRenderElement && overrideRenderElement(props);
            if (overridedElement) {
              return overridedElement;
            }
            return handleRenderElement(props as any, renderElements);
          },
          [renderElements]
        ),
        renderLeaf: useCallback(
          (props: PresenterLeafProps) => {
            const overridedLeaf =
              overrideRenderLeaf && overrideRenderLeaf(props);
            if (overridedLeaf) {
              return overridedLeaf;
            }
            return handleRenderLeaf(props as any, renderLeafs);
          },
          [renderLeafs]
        )
      }}
    >
      <Children children={value} />
    </SlatePresentationContext.Provider>
  );
}
