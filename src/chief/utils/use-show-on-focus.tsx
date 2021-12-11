import React, { CSSProperties, ReactNode, useMemo, useState } from "react";
import { useFocused } from "../../Focused";
import { Show } from "../../show";
import { useChief } from "../hooks/use-chief";
import { useDropdownMenu } from "react-overlays";
import { Element } from "slate";


export function useShowOnFocus(
  element: Element,
  when: { isFocusedWithin?: boolean; isFocused?: boolean; isInside?: boolean; }
) {
  const { isFocusedWithin, isFocused } = useFocused(element);
  const [inside, setInside] = useState(false);
  const { readOnly,  } = useChief();
  const handleEnter = () => {
    !readOnly && setInside(true);
  };
  const handleLeave = () => {
    setInside(false);
  };
  const props = {
    // "data-slate-zero-width": "z",
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
  };
  const { props: dropDownprops } = useDropdownMenu();
  const {
    isFocused: whenIsFocused, isFocusedWithin: whenIsFocusedWithin, isInside: whenIsInside,
  } = when;
  const show = useMemo(() => {
    if (typeof whenIsFocused === "boolean" && isFocused) {
      return true;
    }
    if (typeof whenIsFocusedWithin === "boolean" && isFocusedWithin) {
      return true;
    }
    if (typeof whenIsInside === "boolean" && inside) {
      return true;
    }
    return false;
  }, [
    whenIsFocused,
    whenIsFocusedWithin,
    whenIsInside,
    isFocused,
    isFocusedWithin,
    inside,
  ]);
  const ShouldShow = useMemo(
    () => (props: { children: ReactNode; style?: CSSProperties; }) => {
      const { children, style } = props;
      return (
        <Show when={show}>
          <div
            contentEditable={false}
            role="menu"
            style={{
              position: "absolute",
              zIndex: 2,
              marginTop: 5,
              marginRight: 5,
              ...style,
            }}
            {...dropDownprops}
          >
            {children}
          </div>
        </Show>
      );
    },
    [show]
  );

  return [props, ShouldShow] as const;
}
