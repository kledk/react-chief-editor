import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module "*.svg" {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}

export type ChiefEditor = BaseEditor & ReactEditor & HistoryEditor;

type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: ChiefEditor;
    Element: { type: string; children: CustomText[], [x: string]: any };
    Text: CustomText;
  }
}
