import React from "react";
import { StyledToolbarBtn } from "./ui/styled-toolbar-btn";
import Overlay from "react-overlays/Overlay";
import { Label } from "./chief/chief";
import { useLabels } from "./chief/hooks/use-labels";
import { ElementHoverTip } from "./element-hover-tip";

export type Ref = HTMLElement;

type Props = {
  tooltip?: {
    label: Label;
    shortcut?: string;
    placement?: React.ComponentProps<typeof Overlay>["placement"];
  };
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & React.ComponentProps<typeof StyledToolbarBtn>;

export const ToolbarBtn = React.forwardRef<Ref, Props>((props, ref) => {
  const { onClick, onMouseDown, tooltip, ...otherProps } = props;
  const [labels] = useLabels();

  return (
    <ElementHoverTip
      placement="top"
      tip={
        tooltip && (
          <React.Fragment>
            <div>
              <strong>{labels(tooltip.label)}</strong>
            </div>
            <div>{tooltip.shortcut}</div>
          </React.Fragment>
        )
      }
    >
      <StyledToolbarBtn
        ref={ref}
        onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          if (onClick) {
            onClick(e);
            return;
          }
          onMouseDown && onMouseDown(e);
        }}
        {...otherProps}
      />
    </ElementHoverTip>
  );
});
