import React, { useCallback, useEffect, useRef } from "react";
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

export const useTextColorAddon = () => {
  function TextColorAddon(props: AddonProps) {
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

  function TextColorControl(
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
          shortcut={"mod+k"}
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
                },
                shortcut: shortcutText(shortcut)
              }}
              {...tprops}
              isActive={show}
            >
              Color
            </ToolbarBtn>
          )}
        />
      );
    }
    useControl({
      category: "marks",
      Component: TextColorBtn
    });
    return null;
  }

  return [TextColorAddon, TextColorControl, Presenter] as const;
};

const Presenter: iPresenter<{ url: string } & ChiefElement> = {
  leaf: {
    renderLeaf: props =>
      renderLeaf(props, "color", "span", {
        style: { color: props.leaf["color"] }
      })
  }
};

const shortcut = "mod+m";

function ColorSelector(props: { onClose: () => void; colors: string[] }) {
  const editor = useSlate();
  const { onClose, colors } = props;
  const { selection } = editor;
  const { saveSelection } = useHoverTool();
  useEffect(() => {
    return saveSelection(selection);
  }, []);
  const linkWrapperRef = useRef<HTMLFormElement>(null);
  useOnClickOutside(linkWrapperRef, () => {
    onClose();
  });
  const handleChangeTextColor = useCallback(() => {
    onClose();
  }, [colors]);

  return (
    <div
      style={{
        padding: 9,
        display: "flex",
        flexDirection: "row"
      }}
    >
      <div style={{ display: "flex" }}>
        {colors.map(color => {
          return (
            <div
              onClick={handleChangeTextColor}
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
