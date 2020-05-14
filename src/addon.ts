import React from "react";
import { RenderLeafProps, ReactEditor, RenderElementProps } from "slate-react";
import { NodeEntry, Range } from "slate";

export interface Addon<
  TLabels extends Object = { [key: string]: string },
  TData extends Object = {}
> {
  name?: string;
  renderLeaf?: (
    props: RenderLeafProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
  element?: {
    typeMatch: RegExp;
    renderElement: (
      props: RenderElementProps,
      editor: ReactEditor,
      addon: Addon
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
    renderButton: (
      editor: ReactEditor,
      addon: Addon
    ) => React.ReactNode | React.ReactNode;
  };
  blockInsertMenu?: {
    order: number;
    category?: string;
    renderButton: (editor: ReactEditor) => React.ReactNode | React.ReactNode;
  };
  data?: TData;
  labels?: TLabels & {
    [key: string]: string;
  };
}
