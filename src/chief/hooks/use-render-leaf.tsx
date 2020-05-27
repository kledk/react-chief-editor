import { useEffect } from "react";
import { InjectedRenderLeaf } from "../chief";
import { useChief } from "./use-chief";

export function useRenderLeaf(irl: InjectedRenderLeaf, deps: any[] = []) {
  const chief = useChief();
  useEffect(() => {
    chief.injectRenderLeaf(irl);
    return () => chief.removeRenderLeaf(irl);
  }, deps);
}
