import React from "react";
import { Addon } from "../../addon";
import { Heading } from "./Heading";

export const headingTypes = [
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5"
];

export const HeadingsAddon: Addon = {
  renderElement: props => {
    if (headingTypes.includes(props.element.type)) {
      return <Heading {...props} />;
    }
    return undefined;
  }
};
