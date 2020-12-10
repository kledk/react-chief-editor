import React, { ReactNode } from "react";
import { StyledToolbarBtn } from "./ui/styled-toolbar-btn";
import Overlay from "react-overlays/Overlay";
import { Label } from "./chief/chief";
import { useLabels } from "./chief/hooks/use-labels";
import { ElementHoverTip } from "./element-hover-tip";
import { ControlProps } from "./chief/controls";
import { useTheme } from "styled-components";
import { defaultTheme } from "./defaultTheme";

export type Ref = HTMLElement;

type Props = {
  tooltip?: {
    label: Label;
    shortcut?: string;
    placement?: React.ComponentProps<typeof Overlay>["placement"];
  };
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & ControlProps &
  Omit<React.ComponentProps<typeof StyledToolbarBtn>, "children">;

export const ToolbarBtn = React.forwardRef<Ref, Props>((props, ref) => {
  const { onClick, onMouseDown, tooltip, children, ...otherProps } = props;
  const [labels] = useLabels();
  const theme = useTheme() as typeof defaultTheme;

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
        // @ts-ignore
        ref={ref}
        onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          if (onClick) {
            onClick(e);
            return;
          }
          onMouseDown && onMouseDown(e);
        }}
        {...otherProps}
      >
        {typeof children === "function"
          ? // @ts-ignore
            children({ isActive: props.isActive, theme })
          : children}
      </StyledToolbarBtn>
    </ElementHoverTip>
  );
});
