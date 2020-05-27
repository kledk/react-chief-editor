import React from "react";
import { AddonProps } from "../../addon";
import { Heading } from "./Heading";
import { Transforms, Editor, Range, Element } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import { StyledToolbarBtn } from "../../ui/styled-toolbar-btn";
import { isNodeActive } from "../../utils";
import { ToolbarBtn } from "../../ToolbarBtn";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { RichEditor } from "../../chief/editor";
import { Control } from "../../control";

export const headingTypes = [
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6"
];

export const headingBlockControls: Control[] = [
  {
    category: "headings",
    render: editor => (
      <React.Fragment>
        {headingTypes.map((it, i) => (
          <ToolbarBtn
            isActive={isNodeActive(editor, it)}
            onMouseDown={(
              e: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              e.preventDefault();
              RichEditor.insertBlock(editor, it);
              ReactEditor.focus(editor);
            }}
          >
            {`H${i + 1}`}
          </ToolbarBtn>
        ))}
      </React.Fragment>
    )
  }
];

export const headingContextControls: Control[] = [
  {
    category: "headings",
    render: editor => (
      <React.Fragment>
        {headingTypes.map((it, i) => (
          <HeadingBtn headingType={it}>{`H${i + 1}`}</HeadingBtn>
        ))}
      </React.Fragment>
    )
  }
];

export function HeadingsAddon(props: AddonProps) {
  useRenderElement({
    typeMatch: /heading-[1-6]/,
    renderElement: props => <Heading {...props} />
  });
  useOnKeyDown({
    pattern: "Enter",
    handler: (event, editor) => {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        const [match] = Editor.nodes(editor, {
          match: n =>
            typeof n.type === "string" &&
            Boolean(n.type?.match(/(heading-[1-6])/))
        });
        if (match) {
          event.preventDefault();
          const [node] = match;
          if (Element.isElement(node) && Editor.isEmpty(editor, node)) {
            Transforms.setNodes(editor, { type: "paragraph" });
          } else {
            Transforms.insertNodes(editor, {
              type: "paragraph",
              children: [{ text: "" }]
            });
          }
          return true;
        }
      }
      return false;
    }
  });
  return null;
}

function toggleHeading(editor: Editor, heading: string) {
  const isHeaderOfType = isHeadingType(editor, heading);
  if (isHeaderOfType) {
    Transforms.setNodes(editor, {
      type: "paragraph"
    });
  } else {
    Transforms.setNodes(editor, {
      type: heading
    });
  }
}

export const isHeadingType = (editor: Editor, header: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === header
  });
  return Boolean(match);
};

function insertHeader(editor: Editor, heading: string) {
  Transforms.insertNodes(editor, {
    type: heading,
    children: [{ text: "" }]
  });
}

function HeadingBtn(props: { headingType: string; children: React.ReactNode }) {
  const editor = useSlate();
  const isActive = isHeadingType(editor, props.headingType);
  return (
    <ToolbarBtn
      isActive={isActive}
      onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        toggleHeading(editor, props.headingType);
      }}
    >
      {props.children}
    </ToolbarBtn>
  );
}
