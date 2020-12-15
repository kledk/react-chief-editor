import { ReactNode } from "react";
import { Editor as SlateEditor } from "slate";
import { defaultTheme } from "../../defaultTheme";
import { useSlate } from "slate-react";
import { ChiefElement, ElementTypeMatch, isChiefElement } from "../chief";
import { matchesType } from "../utils/matches-type";

export function useIsControlEligable(opts: {
  typeMatch?: ElementTypeMatch;
  isVoid?: boolean;
  isText?: boolean;
  isEmpty?: boolean;
}) {
  const editor = useSlate();
  const { selection } = editor;
  if (selection) {
    const [match] = SlateEditor.nodes(editor, {
      at: selection,
      voids: opts.isVoid,
      match: n => {
        // console.log(n && SlateEditor.isEmpty(editor, n as ChiefElement));
        if (opts.typeMatch && typeof n.type === "string") {
          if (matchesType(n as ChiefElement, opts.typeMatch)) {
            return true;
          }
        } else if (
          typeof opts.isVoid === "boolean" &&
          opts.isVoid === SlateEditor.isVoid(editor, n)
        ) {
          return true;
        } else if (
          opts.isEmpty &&
          isChiefElement(n) &&
          SlateEditor.isEmpty(editor, n)
        ) {
          return true;
        } else if (
          opts.isText &&
          SlateEditor.string(editor, selection).length > 0
        ) {
          return true;
        }
        return false;
      }
    });
    return Boolean(match);
  }
  return false;
}

export type RenderControlProps = {
  isActive: boolean;
  theme: typeof defaultTheme;
};
export type ControlChildrenProp =
  | ((props: RenderControlProps) => ReactNode)
  | ReactNode;
export type ControlProps = {
  children: ControlChildrenProp;
};
