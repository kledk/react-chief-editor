import React from "react";
import { AddonProps } from "../../addon";
import { useLabels } from "../../chief/hooks/use-labels";

export function LabelsAddon(props: Pick<AddonProps, "labels">) {
  useLabels(props.labels);
  return null;
}
