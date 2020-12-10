import React, { ReactNode } from "react";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { ParagraphElement } from "./paragraph-element";
import { useLabels, ElementTypeMatch, RichEditor } from "../../chief";
import { AddonProps } from "../../addon";
import { iPresenter } from "../../chief/chief-presentation";
import { useControl } from "../../chief/controls";
import { ToolbarBtn } from "../../ToolbarBtn";
import { isNodeActive } from "../../utils";
import { ReactEditor, useSlate } from "slate-react";

const TYPE: ElementTypeMatch = "paragraph";

export function ParagraphControl(props: { children: ReactNode }) {
  return useControl({
    category: "text",
    Component: () => {
      const editor = useSlate();
      return (
        <ToolbarBtn
          tooltip={{
            label: {
              key: `elements.paragraph.placeholder`,
              defaultLabel: "Paragraph"
            }
          }}
          isActive={isNodeActive(editor, "paragraph")}
          onMouseDown={() => {
            RichEditor.insertBlock(editor, "paragraph");
            ReactEditor.focus(editor);
          }}
        >
          {props.children}
        </ToolbarBtn>
      );
    }
  });
}

export function ParagraphAddon({
  showHint = true,
  showPlaceholder = true,
  labels
}: {
  showHint?: boolean;
  showPlaceholder?: boolean;
} & AddonProps) {
  const [getLabel] = useLabels(labels);
  useRenderElement(
    {
      typeMatch: TYPE,
      renderElement: props => (
        <ParagraphElement
          hint={
            showHint
              ? getLabel({
                  key: "elements.paragraph.hint",
                  defaultLabel: "Click to start typing"
                })
              : undefined
          }
          placeholder={
            showPlaceholder
              ? getLabel({
                  key: "elements.paragraph.placeholder",
                  defaultLabel: "Text"
                })
              : undefined
          }
          {...props}
        ></ParagraphElement>
      )
    },
    [getLabel]
  );
  return null;
}

const ParagraphPresenter: iPresenter = {
  element: {
    typeMatch: TYPE,
    renderElement: props => <p>{props.children}</p>
  }
};

ParagraphAddon.Presenter = ParagraphPresenter;
