import React, { useState } from "react";
import { RenderElementProps } from "slate-react";
import { useFocused } from "./Focused";
import { Show } from "./show";

export function ElementWrapper(
  props: RenderElementProps & {
    attentionChildren?: React.ReactNode;
    style?: React.CSSProperties;
  }
) {
  const { children, element, attentionChildren, style, ...otherProps } = props;
  const { isFocusedWithin } = useFocused(element);
  const [inside, setInside] = useState(false);
  const handleEnter = () => {
    setInside(true);
  };
  const handleLeave = () => {
    setInside(false);
  };
  return (
    <div
      data-slate-zero-width="z"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: "relative" }}
    >
      <Show when={isFocusedWithin || inside}>
        <div
          contentEditable={false}
          style={{ position: "absolute", zIndex: 2, ...style }}
        >
          {attentionChildren}
        </div>
      </Show>
      {children}
    </div>
  );
}
