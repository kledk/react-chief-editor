import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { Editor, Node, Text, Transforms } from "slate";
import { useSlate } from "slate-react";
import { AddonProps } from "../../addon";
import { ChiefElement, iPresenter, useRenderLeaf } from "../../chief";
import { renderLeaf } from "../../leaf-renderer";
import { StyledToolBox } from "../../ui/StyledToolBox";
import { ToolbarBtn } from "../../ToolbarBtn";
import { ToolBtnPopup } from "../../ToolBtnPopup";
import {
  getActiveNode,
  getNodeFromSelection,
  useOnClickOutside,
} from "../../utils";
import { useSaveSelection } from "../../chief/utils/saved-selection";
import { ControlProps, useIsControlEligable } from "../../chief/controls";

export function TextColorAddon() {
  useRenderLeaf({
    renderLeaf: (props) => {
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
    },
  });
  return null;
}

export function TextColorControl(props: { colors?: string[] } & ControlProps) {
  if (
    !useIsControlEligable({
      isText: true,
    })
  ) {
    return null;
  }
  return (
    <ToolBtnPopup
      renderContent={(setShow) => (
        <StyledToolBox>
          <ColorSelector
            colors={
              props.colors || [
                "rgb(142, 209, 252)",
                "rgb(132, 109, 52)",
                "rgb(42, 09, 232)",
                "rgb(54, 209, 12)",
              ]
            }
            onClose={() => setShow(false)}
          />
        </StyledToolBox>
      )}
      renderToolBtn={(tprops, show) => (
        <ToolbarBtn
          tooltip={{
            label: {
              key: "marks.textcolor",
              defaultLabel: "Textcolor",
            },
          }}
          {...tprops}
          isActive={show}
        >
          {props.children}
        </ToolbarBtn>
      )}
    />
  );
}

const Presenter: iPresenter<{ url: string } & ChiefElement> = {
  leaf: {
    renderLeaf: (props) =>
      renderLeaf(props, "color", "span", {
        style: { color: props.leaf["color"] },
      }),
  },
};
TextColorAddon.Presenter = Presenter;

function ColorSelector(props: { onClose: () => void; colors: string[] }) {
  const editor = useSlate();
  const { onClose, colors } = props;
  const { selection } = editor;
  const { saveSelection } = useSaveSelection();
  let node: Node | null = null;
  if (selection) {
    const [_node] = Editor.nodes(editor, {
      at: selection,
      match: (n) => Boolean(n["color"]),
    });
    node = _node && _node[0];
  }
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
        { match: (n) => Text.isText(n), split: true }
      );
      onClose();
    },
    [colors]
  );

  return (
    <div
      style={{
        padding: 5,
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 170 }}>
          <ToolbarBtn
            tooltip={{
              label: {
                key: "color.default",
                defaultLabel: "Default",
              },
            }}
            onClick={() => handleChangeTextColor(undefined)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 24,
              height: 24,
              border: "1px solid rgb(236 236 236)",
              margin: 2,
              cursor: "pointer",
            }}
          >
            A
          </ToolbarBtn>
          {colors.map((color, i) => {
            return (
              <ToolbarBtn
                tooltip={{
                  label: {
                    key: `color.${color}`,
                    defaultLabel: color,
                  },
                }}
                key={i}
                onClick={() => handleChangeTextColor(color)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid rgb(236 236 236)",
                  width: 24,
                  height: 24,
                  margin: 2,
                  color: color,
                  cursor: "pointer",
                }}
              >
                A
              </ToolbarBtn>
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
    </div>
  );
}
