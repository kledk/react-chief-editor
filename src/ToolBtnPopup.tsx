import React, { useState, useRef } from "react";
import { Popper, Manager, Reference } from "react-popper";
import { useOnClickOutside } from "./utils";
import { useOnKeyDown } from "./chief";

export function ToolBtnPopup(props: {
  shortcut?: string;
  renderContent: (setShow: (show: boolean) => void) => React.ReactNode;
  renderToolBtn: (
    props: {
      ref: React.Ref<any>;
      onMouseDown: (e: React.MouseEvent) => void;
    },
    show: boolean
  ) => React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const toolWindow = useRef(null);
  useOnClickOutside(toolWindow, e => {
    if (!e.defaultPrevented) {
      setShow(false);
    }
    e.preventDefault();
  });
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 27) {
      setShow(false);
    }
  };
  useOnKeyDown({
    pattern: props.shortcut,
    handler: () => setShow(!show)
  });
  return (
    <Manager>
      <Reference>
        {({ ref }) =>
          props.renderToolBtn(
            {
              ref,
              onMouseDown: e => {
                e.preventDefault();
                setShow(!show);
              }
            },
            show
          )
        }
      </Reference>
      <Popper
        placement="bottom-start"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [-100, 10]
            }
          }
        ]}
      >
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={style} data-placement={placement}>
            {show && (
              <div onKeyDown={handleKeyDown} ref={toolWindow}>
                {props.renderContent(setShow)}
              </div>
            )}
            <div ref={arrowProps.ref} style={arrowProps.style} />
          </div>
        )}
      </Popper>
    </Manager>
  );
}
