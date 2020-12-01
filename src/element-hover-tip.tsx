import React, { useRef, ReactNode, useState, useEffect } from "react";
import Overlay from "react-overlays/Overlay";
import { useGlobalHover, useHover } from "./utils";
import styled, { css } from "styled-components";
import { UiWrap } from "./ui/ui-wrap";

export function ElementHoverTip(
  props: {
    children:
      | ReactNode
      | ((
          triggerRef: React.RefObject<HTMLDivElement>,
          isHovering: boolean
        ) => ReactNode);
    tip?: ReactNode;
    delayed?: boolean;
  } & Omit<
    React.ComponentProps<typeof Overlay>,
    "children" | "target" | "container"
  >
) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const [triggerRef, isHovering] = useHover<HTMLDivElement>();
  const isOverlayHovering = useGlobalHover(overlayRef.current);
  const isOverlayHoveringRef = useRef(isOverlayHovering);
  isOverlayHoveringRef.current = isOverlayHovering;
  const isHoveringRef = useRef(isHovering);
  isHoveringRef.current = isHovering;
  const [show, setShow] = useState(isHovering);
  useEffect(() => {
    if (isHovering) {
      setShow(true);
    } else if (delayed) {
      setTimeout(() => !isOverlayHoveringRef.current && setShow(false), 150);
    } else {
      setShow(false);
    }
  }, [isHovering]);
  useEffect(() => {
    if (!isOverlayHovering) {
      setTimeout(() => !isHoveringRef.current && setShow(false), 150);
    }
  }, [isOverlayHovering]);
  const { children, tip, delayed, ...overlayProps } = props;
  const overlay = (
    <Overlay
      ref={overlayRef}
      show={Boolean(tip) && show}
      container={containerRef}
      target={triggerRef}
      {...overlayProps}
    >
      {({ props, arrowProps, placement }) => (
        <Tooltip {...props} placement={placement}>
          <Arrow
            {...arrowProps}
            placement={placement}
            style={arrowProps.style}
          />
          <StyledTooltipBody>{tip}</StyledTooltipBody>
        </Tooltip>
      )}
    </Overlay>
  );
  const container = (
    <div
      contentEditable={false}
      style={{ position: "absolute", width: "100%" }}
      ref={containerRef}
    ></div>
  );
  if (typeof children === "function") {
    return (
      <React.Fragment>
        {container}
        {children(triggerRef, isHovering)}
        {overlay}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        {container}
        <span ref={triggerRef}>{children}</span>
        {overlay}
      </React.Fragment>
    );
  }
}

export const StyledTooltipBody = styled(UiWrap)`
  width: 100%;
  font-size: 12px;
  padding: 3px 8px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  background-color: #000;
  div:nth-child(1) {
  }
  div:nth-child(2) {
    font-weight: bold;
    font-size: 0.7em;
    color: ${props => props.theme.colors.gray[400]};
  }
`;

export const Arrow = styled.div<{ placement: string }>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;

  ${p => {
    switch (p.placement) {
      case "left":
        return css`
          right: 0;
          border-width: 5px 0 5px 5px;
          border-color: transparent transparent transparent #000;
        `;
      case "right":
        return css`
          left: 0;
          border-width: 5px 5px 5px 0;
          border-color: transparent #232323 transparent transparent;
        `;
      case "top":
        return css`
          bottom: 0;
          border-width: 5px 5px 0;
          border-color: #232323 transparent transparent transparent;
        `;
      case "bottom":
        return css`
          top: 0;
          border-width: 0 5px 5px;
          border-color: transparent transparent #232323 transparent;
        `;
      default:
        return "";
    }
  }}
`;

export const Tooltip = styled.div<{ placement: string }>`
  position: absolute;
  padding: 0 5px;

  ${p => {
    switch (p.placement) {
      case "left":
        return css`
          padding: 0 5px;
        `;
      case "right":
        return css`
          padding: 0 5px;
        `;
      case "top":
        return css`
          padding: 5px 0;
        `;
      case "bottom":
        return css`
          padding: 5px 0;
        `;
      default:
        return "";
    }
  }}
`;
