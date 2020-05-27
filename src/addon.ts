import React from "react";
import { ReactEditor, RenderElementProps } from "slate-react";
import { NodeEntry, Range } from "slate";
import {
  InjectedRenderLeaf,
  InjectedRenderElement,
  InjectedLabels
} from "./chief/chief";
import { KeyHandler } from "./chief/key-handler";

type OnPluginMap = {
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

export type OnPlugin = Pick<OnPluginMap, KnownKeys<OnPluginMap>>;

export interface AddonProps {
  name?: string;
  onKey?: KeyHandler;
  renderLeaf?: InjectedRenderLeaf;
  renderElement?: InjectedRenderElement;
  onPlugin?: OnPlugin;
  decorate?: (entry: NodeEntry, editor: ReactEditor) => Range[];
  onClick?(event: React.MouseEvent<HTMLElement>, editor: ReactEditor): void;
  hoverMenu?: {
    order: number;
    typeMatch?: RegExp;
    category?: string;
    renderButton: (
      editor: ReactEditor,
      addon: AddonProps
    ) => React.ReactNode | React.ReactNode;
  };
  blockInsertMenu?: {
    order: number;
    category?: string;
    renderButton: (editor: ReactEditor) => React.ReactNode | React.ReactNode;
  };
  labels?: InjectedLabels;
}
