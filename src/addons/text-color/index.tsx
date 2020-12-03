import React, { useCallback, useEffect, useRef } from "react";
import { Text, Transforms } from "slate";
import { useEditor, useSlate } from "slate-react";
import { AddonProps } from "../../addon";
import { ChiefElement, iPresenter, useRenderLeaf } from "../../chief";
import { Control } from "../../control";
import { renderLeaf } from "../../leaf-renderer";
import { MarkBtn } from "../../mark-button";
import { shortcutText } from "../../shortcut";
import { StyledToolBox } from "../../StyledToolBox";
import { ToolbarBtn } from "../../ToolbarBtn";
import { ToolBtnPopup } from "../../ToolBtnPopup";
import { useOnClickOutside } from "../../utils";
import { useControl, useHoverTool } from "../hovering-tool";

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

export function TextColorControl(
  props: { colors: string[] } = {
    colors: [
      "rgb(142, 209, 252)",
      "rgb(132, 109, 52)",
      "rgb(42, 09, 232)",
      "rgb(54, 209, 12)"
    ]
  }
) {
  function TextColorBtn() {
    return (
      <ToolBtnPopup
        renderContent={setShow => (
          <StyledToolBox>
            <ColorSelector
              colors={props.colors}
              onClose={() => setShow(false)}
            />
          </StyledToolBox>
        )}
        renderToolBtn={(tprops, show) => (
          <ToolbarBtn
            tooltip={{
              label: {
                key: "marks.color",
                defaultLabel: "Color"
              }
            }}
            {...tprops}
            isActive={show}
          >
            C
          </ToolbarBtn>
        )}
      />
    );
  }
  return useControl({
    category: "color",
    Component: TextColorBtn
  });
}

const Presenter: iPresenter<{ url: string } & ChiefElement> = {
  leaf: {
    renderLeaf: props =>
      renderLeaf(props, "color", "span", {
        style: { color: props.leaf["color"] }
      })
  }
};
TextColorAddon.Presenter = Presenter;

function ColorSelector(props: { onClose: () => void; colors: string[] }) {
  const editor = useSlate();
  const { onClose, colors } = props;
  const { selection } = editor;
  const { saveSelection } = useHoverTool();
  useEffect(() => {
    return saveSelection(selection);
  }, []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, () => {
    onClose();
  });
  const handleChangeTextColor = useCallback(
    (color?: string) => {
      Transforms.setNodes(
        editor,
        { color },
        { match: n => Text.isText(n), split: true }
      );
      onClose();
    },
    [colors]
  );

  return (
    <div
      ref={wrapperRef}
      style={{
        padding: 9,
        display: "flex",
        flexDirection: "row"
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          onClick={() => handleChangeTextColor(undefined)}
          style={{
            width: 18,
            height: 18,
            margin: 2,
            backgroundColor: "none",
            cursor: "pointer"
          }}
        />
        {colors.map((color, i) => {
          return (
            <div
              key={i}
              onClick={() => handleChangeTextColor(color)}
              style={{
                width: 18,
                height: 18,
                margin: 2,
                backgroundColor: color,
                cursor: "pointer"
              }}
            />
          );
        })}
      </div>
      {/* <div style={{ display: "flex" }}>
        {bgColors.map(color => {
          return (
            <div
              onClick={handleChangeBgColor}
              style={{
                width: 18,
                height: 18,
                margin: 2,
                backgroundColor: color,
                cursor: "pointer"
              }}
            />
          );
        })}
      </div> */}
    </div>
  );
}
