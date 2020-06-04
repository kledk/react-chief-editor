import { useEffect, useCallback } from "react";
import { InjectedLabels, Label } from "../chief";
import { useChief } from "./use-chief";

export function useLabels(labels?: InjectedLabels) {
  const { labels: injectedLabels, injectLabels } = useChief();
  const getLabel = useCallback(
    (label: Label) => {
      if (typeof injectedLabels[label.key] === "string") {
        return injectedLabels[label.key];
      }
      return label.defaultLabel;
    },
    [injectedLabels]
  );

  useEffect(() => {
    if (labels) {
      injectLabels(labels);
    }
  }, []);

  return [getLabel, injectLabels] as const;
}
