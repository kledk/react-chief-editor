import React, {
  useEffect,
  useState,

  useContext
} from "react";
import { Control } from "../../control";

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
