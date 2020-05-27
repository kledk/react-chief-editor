import { useEffect } from "react";
import { OnPlugin } from "../../addon";
import { useChief } from "./use-chief";

export function usePlugin(plugin: OnPlugin) {
  const chief = useChief();
  useEffect(() => {
    chief.injectPlugin(plugin);
    return () => chief.removePlugin(plugin);
  }, []);
}
