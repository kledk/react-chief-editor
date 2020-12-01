import React, { useEffect } from "react";
import {
  RenderLeafProps,
  ReactEditor,
  RenderElementProps,
  Slate
} from "slate-react";
import { Node, Element, NodeEntry, Range } from "slate";
import merge from "lodash/merge";
import { ChiefEditorTheme } from "../chief-editor-theme";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "../defaultTheme";
import { useProvideChiefContext, ChiefContext } from "./chief-context";

export function isChiefElement(element: unknown): element is ChiefElement {
  return (element as ChiefElement).type !== undefined;
}

export type ChiefElement = Element & {
  type: string;
};

export type ChiefRenderElementProps<
  T extends ChiefElement = ChiefElement
> = RenderElementProps & {
  element: T;
};

export type ElementTypeMatch = RegExp | string | readonly string[];

export type InjectedRenderLeaf = {
  renderLeaf: (
    props: RenderLeafProps,
    editor?: ReactEditor
  ) => JSX.Element | undefined;
};

export type InjectedRenderElement<T extends ChiefElement = ChiefElement> = {
  typeMatch?: ElementTypeMatch;
  Component?: React.FunctionComponent<ChiefRenderElementProps>;
  renderElement?:
    | JSX.Element
    | ((
        props: ChiefRenderElementProps<T>,
        editor?: ReactEditor
      ) => JSX.Element | undefined);
};

export type InjectedLabels = { [key: string]: string | undefined };
export type Label = { key: string; defaultLabel: string };

export type InjectedDecorator = {
  decorator: (
    entry: NodeEntry<Node>,
    editor: ReactEditor
  ) => Range[] | undefined;
  priority?: "high" | "low";
};

export const Chief = React.memo(function(props: {
  value: Node[];
  onChange: (value: Node[]) => void;
  children: React.ReactNode;
  readOnly?: boolean;
  id?: string;
  theme?: ChiefEditorTheme & { [key: string]: any };
}) {
  const { children, onChange, value, readOnly, id, theme } = props;
  const _theme = merge({}, defaultTheme, theme);
  const chiefValue = useProvideChiefContext({ readOnly, id });

  return (
    <Slate editor={chiefValue.editor} value={value} onChange={onChange}>
      <ChiefContext.Provider value={chiefValue}>
        <ThemeProvider theme={_theme}>
          <React.Fragment>{children}</React.Fragment>
        </ThemeProvider>
      </ChiefContext.Provider>
    </Slate>
  );
});
