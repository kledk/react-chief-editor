import { ReactEditor } from "slate-react";
import {
  InjectedLabels
} from "./chief/chief";

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
