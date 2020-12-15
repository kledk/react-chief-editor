import React, { ReactNode } from "react";
import { AddonProps } from "../../addon";
import { Heading } from "./Heading";
import { Transforms, Editor, Range, Element } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import { isNodeActive } from "../../utils";
import { ToolbarBtn } from "../../ToolbarBtn";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { RichEditor } from "../../chief/editor";
import { iPresenter } from "../../chief/chief-presentation";
import { ControlProps, useIsControlEligable } from "../../chief/controls";

export const headingTypes = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export function HeadingControl(
  props: {
    heading: typeof headingTypes[number];
  } & ControlProps
) {
  const { heading, children } = props;
  const editor = useSlate();
  if (
    !useIsControlEligable({
      isText: true,
      isEmpty: true
    })
  ) {
    return null;
  }
  return (
    <ToolbarBtn
      tooltip={{
        label: {
          key: `elements.heading.${heading}.placeholder`,
          defaultLabel: heading
        }
      }}
      isActive={isNodeActive(editor, heading)}
      onMouseDown={(_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ReactEditor.focus(editor);
        RichEditor.insertBlock(editor, heading);
      }}
    >
      {children || heading.toUpperCase()}
    </ToolbarBtn>
  );
}

const Presenter: iPresenter = {
  element: {
    typeMatch: headingTypes,
    renderElement: props =>
      React.createElement(props.element.type, null, props.children)
  }
};

export function HeadingsAddon(_props: AddonProps) {
  useRenderElement({
    typeMatch: headingTypes,
    renderElement: props => <Heading {...props} />
  });
  useOnKeyDown({
    pattern: "Enter",
    handler: (event, editor) => {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        const [match] = Editor.nodes(editor, {
          match: n =>
            typeof n.type === "string" && Boolean(n.type?.match(/(h[1-6])/))
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

HeadingsAddon.Presenter = Presenter;
