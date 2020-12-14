import React, { ReactNode, useEffect, useState, useContext } from "react";
import { Editor as SlateEditor } from "slate";
import { Control } from "./control";
import { defaultTheme } from "../../defaultTheme";
import { useSlate } from "slate-react";
import { ChiefElement, ElementTypeMatch } from "../chief";
import { matchesType } from "../utils/matches-type";

export function useIsControlEligable(typeMatch?: ElementTypeMatch) {
  const editor = useSlate();
  const { selection } = editor;
  if (selection) {
    const [match] = SlateEditor.nodes(editor, {
      match: n => {
        if (typeMatch && typeof n.type === "string") {
          if (matchesType(n as ChiefElement, typeMatch)) {
            return true;
          }
        } else if (
          !typeMatch &&
          !SlateEditor.isVoid(editor, n) &&
          typeof n.type === "string"
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
