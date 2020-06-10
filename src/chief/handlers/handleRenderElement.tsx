import React from "react";
import { ReactEditor } from "slate-react";
import { InjectedRenderElement, ChiefRenderElementProps } from "../chief";
import { matchesType } from "../utils/matches-type";

export function handleRenderElement(
  props: ChiefRenderElementProps,
  renderElements: InjectedRenderElement[],
  editor?: ReactEditor
) {
  let element: JSX.Element | undefined;
  for (let renderElement of renderElements) {
    if (
      renderElement.typeMatch === undefined ||
      matchesType(props.element, renderElement.typeMatch)
    ) {
      if (renderElement.Component) {
        element = <renderElement.Component {...props} />;
      } else if (renderElement.renderElement) {
        element =
          typeof renderElement.renderElement === "function"
            ? renderElement.renderElement(props, editor)
            : React.cloneElement(renderElement.renderElement, props) || element;
      }
    }
  }

  return (element = element || <React.Fragment>{null}</React.Fragment>);
}
