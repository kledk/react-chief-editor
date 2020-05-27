import { useEffect } from "react";
import { ChiefElement, InjectedRenderElement } from "../chief";
import { useChief } from "./use-chief";

export function useRenderElement<T extends ChiefElement = ChiefElement>(
  ire: InjectedRenderElement<T>,
  deps: any[] = []
) {
  const chief = useChief();
  useEffect(() => {
    chief.injectRenderElement(ire);
    return () => chief.removeRenderElement(ire);
  }, deps);
}
