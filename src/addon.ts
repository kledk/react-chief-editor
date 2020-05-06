import React from "react";
import { RenderLeafProps, ReactEditor, RenderElementProps } from "slate-react";
import { NodeEntry, Range } from "slate";

export interface Addon {
  name?: string;
  renderLeaf?: (
    props: RenderLeafProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
  element?: {
    typeMatch: RegExp;
    renderElement: (
      props: RenderElementProps,
      editor: ReactEditor
    ) => JSX.Element | undefined;
  };
  withPlugin?(editor: ReactEditor): ReactEditor;
  decorate?: (entry: NodeEntry, editor: ReactEditor) => Range[];
  onKeyDown?(
    event: React.KeyboardEvent<HTMLElement>,
    editor: ReactEditor
  ): boolean | undefined;
  onClick?(event: React.MouseEvent<HTMLElement>, editor: ReactEditor): void;
  hoverMenu?: {
    order: number;
    typeMatch?: RegExp;
    category?: string;
    renderButton: () => React.ReactNode | React.ReactNode;
  };
}
