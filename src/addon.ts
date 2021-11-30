import { Editor } from "slate";
import {
  InjectedLabels
} from "./chief/chief";

type OnPluginMap = {
  [key in keyof Editor]?: (
    fn: Editor[key],
    editor: Editor
  ) => Editor[key];
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
