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

const ControlsContext = React.createContext<ReturnType<
  typeof useProvideControlContext
> | null>(null);

export function useProvideControlContext() {
  const [controls, setControls] = useState<Control[]>([]);
  function injectControl(control: Control) {
    setControls(controls => [...controls, control]);
  }

  function removeControl(control: Control) {
    setControls(it => {
      const toSlicer = [...it];
      toSlicer.splice(toSlicer.indexOf(control), 1);
      return toSlicer;
    });
  }
  return { controls, injectControl, removeControl };
}

export function useControlsProvider() {
  const value = useProvideControlContext();
  return [ControlsContext, value] as const;
}

export function useProvidedControls() {
  const ctx = useContext(ControlsContext);
  if (!ctx) {
    throw new Error("No ControlsContext.Provider in scope.");
  }
  return ctx;
}

export function useControl<T extends React.FunctionComponent<any>>(
  control: Control<T>
) {
  const { injectControl, removeControl } = useProvidedControls();
  useEffect(() => {
    injectControl(control);
    return () => removeControl(control);
  }, []);
  return null;
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
