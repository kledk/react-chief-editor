import React from "react";
import { ReactEditor, RenderElementProps } from "slate-react";
import { NodeEntry, Range } from "slate";
import {
  InjectedRenderLeaf,
  InjectedRenderElement,
  KeyHandler
} from "./chief/chief";

type OnPlugin = {
  [key in keyof ReactEditor]?: (
    fn: ReactEditor[key],
    editor: ReactEditor
  ) => ReactEditor[key];
};

type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export interface Addon<
  TLabels extends Object = { [key: string]: string },
  TData extends Object = {}
> {
  name?: string;
  onKey?: KeyHandler;
  renderLeaf?: InjectedRenderLeaf;
  renderElement?: InjectedRenderElement;
  onPlugin?: Pick<OnPlugin, KnownKeys<OnPlugin>>;
  decorate?: (entry: NodeEntry, editor: ReactEditor) => Range[];
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
  labels?: TLabels;
  [key: string]: any;
}
