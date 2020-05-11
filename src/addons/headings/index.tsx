import React from "react";
import { Addon } from "../../addon";
import { Heading } from "./Heading";
import { Transforms, Editor, Range, Element } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import { StyledToolbarBtn } from "../../StyledToolbarBtn";
import { isNodeActive } from "../../utils";
import { RichEditor } from "../../aeditor";
import { ToolbarBtn } from "../../ToolbarBtn";

export const headingTypes = [
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6"
];

export const HeadingsAddon: Addon = {
  element: {
    typeMatch: /heading-[1-6]/,
    renderElement: props => {
      return <Heading {...props} />;
    }
  },
  onKeyDown: (event, editor) => {
    if (event.keyCode === 13) {
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
    }
    return false;
  },
  hoverMenu: {
    order: 4,
    category: "heading",
    renderButton: () => {
      return (
        <React.Fragment>
          <HeadingBtn headingType="heading-1">H1</HeadingBtn>
          <HeadingBtn headingType="heading-2">H2</HeadingBtn>
          <HeadingBtn headingType="heading-3">H3</HeadingBtn>
          <HeadingBtn headingType="heading-4">H4</HeadingBtn>
          <HeadingBtn headingType="heading-5">H5</HeadingBtn>
        </React.Fragment>
      );
    }
  },
  blockInsertMenu: {
    order: 1,
    category: "heading",
    renderButton: editor => {
      return (
        <React.Fragment>
          <ToolbarBtn
            isActive={isNodeActive(editor, "heading-1")}
            onClick={() => {
              RichEditor.insertBlock(editor, "heading-1");
              ReactEditor.focus(editor);
            }}
          >
            H1
          </ToolbarBtn>
          <ToolbarBtn
            isActive={isNodeActive(editor, "heading-2")}
            onClick={() => {
              RichEditor.insertBlock(editor, "heading-2");
              ReactEditor.focus(editor);
            }}
          >
            H2
          </ToolbarBtn>
          <ToolbarBtn
            isActive={isNodeActive(editor, "heading-3")}
            onClick={() => {
              RichEditor.insertBlock(editor, "heading-3");
              ReactEditor.focus(editor);
            }}
          >
            H3
          </ToolbarBtn>
        </React.Fragment>
      );
    }
  }
};

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

function HeadingBtn(props: { headingType: string; children: React.ReactNode }) {
  const editor = useSlate();
  const isActive = isHeadingType(editor, props.headingType);
  return (
    <ToolbarBtn
      isActive={isActive}
      onClick={() => toggleHeading(editor, props.headingType)}
    >
      {props.children}
    </ToolbarBtn>
  );
}
