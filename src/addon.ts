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
  labels?: InjectedLabels;
}
