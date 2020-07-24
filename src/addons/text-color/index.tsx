import React from "react";
import { AddonProps } from "../../addon";
import { useRenderLeaf } from "../../chief";

export function TextColorAddon(props: AddonProps) {
  useRenderLeaf({
    renderLeaf: props => {
      if (typeof props.leaf["color"] === "string")
        return (
          <span
            style={{ color: props.leaf["color"] as string }}
            {...props.attributes}
          >
            {props.children}
          </span>
        );
      return undefined;
    }
  });
  return null;
}
