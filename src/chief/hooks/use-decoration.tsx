import { useEffect } from "react";
import { useChief } from "./use-chief";
import { InjectedDecorator } from "../chief";

export function useDecoration(decoration: InjectedDecorator, deps?: any[]) {
  const chief = useChief();
  useEffect(() => {
    chief.injectDecoration(decoration);
    return () => chief.removeDecoration(decoration);
  }, deps);
}
